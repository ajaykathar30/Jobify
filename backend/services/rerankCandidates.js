import Job from "../models/job.js";
import Application from "../models/application.js";
import AiDocument from "../models/aiDocument.js";
import { rankApplicants } from "./rankApplicants.js";
import genaiClient from "../utils/genaiClient.js";

const SHORTLIST_SIZE = 2;

const rerankSchema = {
  type: "object",
  description: "Calibrated fit score for a candidate's resume against a job",
  properties: {
    score: {
      type: "number",
      description: "Overall fit score between 0 and 100. Be a strict reviewer - reserve high scores for genuinely strong fits.",
      minimum: 0,
      maximum: 100
    },
    matchedRequirements: {
      type: "array",
      description: "Job requirements the resume clearly satisfies",
      items: { type: "string" }
    },
    missingRequirements: {
      type: "array",
      description: "Job requirements the resume does not show evidence of",
      items: { type: "string" }
    },
    reasoning: {
      type: "string",
      description: "A short 1-2 sentence explanation for the score"
    }
  },
  required: ["score", "reasoning"]
};

export const rerankCandidates = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  const stage1 = await rankApplicants(jobId);
  const shortlist = stage1.filter(r => r.score > 0).slice(0, SHORTLIST_SIZE);

  if (!shortlist.length) {
    return [];
  }

  const applicantIds = shortlist.map(r => r.userId);
  const resumeDocs = await AiDocument.find({ userId: { $in: applicantIds }, docType: "resume" });
  const resumeTextByUser = {};
  for (const doc of resumeDocs) {
    resumeTextByUser[doc.userId.toString()] = doc.chunkText;
  }

  const jobText = `Job Title: ${job.title}\nDescription: ${job.description}\nRequirements: ${job.requirements || "N/A"}`;

  const results = await Promise.all(
    shortlist.map(async ({ userId }) => {
      const resumeText = resumeTextByUser[userId.toString()];
      if (!resumeText) return null;

      try {
        const response = await genaiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Score how well this candidate's resume fits the job below, from 0 to 100. List the job requirements the resume clearly satisfies, the ones it's missing, and give a short reasoning.\n\n${jobText}\n\nResume:\n${resumeText}`,
          config: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseJsonSchema: rerankSchema
          }
        });
        const parsed = JSON.parse(response.text);
        return { userId, ...parsed };
      } catch (error) {
        console.error(`Rerank failed for applicant ${userId}:`, error);
        return null;
      }
    })
  );

  const updates = results.filter(Boolean);

  await Promise.all(
    updates.map(r =>
      Application.updateOne(
        { job: jobId, applicant: r.userId },
        {
          aiRerank: {
            score: r.score,
            matchedRequirements: r.matchedRequirements || [],
            missingRequirements: r.missingRequirements || [],
            reasoning: r.reasoning,
            rerankedAt: new Date()
          }
        }
      )
    )
  );

  return updates;
};
