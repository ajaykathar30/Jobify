import AiDocument from "../models/aiDocument.js";
import Job from "../models/job.js";
import Application from "../models/application.js";

const VECTOR_INDEX_NAME = "resume_vector_index";
const CANDIDATE_LIMIT = 30;
const RECOMMENDATION_COUNT = 6;

export const getJobRecommendations = async (userId) => {
  const resumeDoc = await AiDocument.findOne({ userId, docType: "resume" });
  if (!resumeDoc) {
    throw new Error("No resume found");
  }

  const results = await AiDocument.aggregate([
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME,
        path: "embedding",
        queryVector: resumeDoc.embedding,
        exact: true,
        limit: CANDIDATE_LIMIT,
        filter: { docType: "job" }
      }
    },
    { $project: { _id: 0, jobId: 1, score: { $meta: "vectorSearchScore" } } }
  ]);

  // Multiple chunks can belong to the same job - keep each job's best chunk score
  const bestScoreByJob = {};
  for (const r of results) {
    const jid = r.jobId.toString();
    bestScoreByJob[jid] = Math.max(bestScoreByJob[jid] || 0, r.score);
  }

  const appliedJobIds = new Set(
    (await Application.find({ applicant: userId }).select("job")).map(a => a.job.toString())
  );

  const now = new Date();
  const candidateJobIds = Object.keys(bestScoreByJob).filter(id => !appliedJobIds.has(id));

  const jobs = await Job.find({
    _id: { $in: candidateJobIds },
    status: { $ne: "closed" },
    $or: [{ deadline: null }, { deadline: { $gt: now } }]
  }).populate("company");

  jobs.sort((a, b) => bestScoreByJob[b._id.toString()] - bestScoreByJob[a._id.toString()]);

  return jobs.slice(0, RECOMMENDATION_COUNT);
};
