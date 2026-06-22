import AiDocument from "../models/aiDocument.js";
import genaiClient from "../utils/genaiClient.js";

const analyzeResume = async (userID) => {
  const analysisSchema = {
    type: "object",
    description: "Analysis of a resume with improvement suggestions",
    properties: {
      summary: {
        type: "string",
        description: "A very short professional summary in 1–2 concise sentences only. Do not exceed 40 words."
      },

      strengths: {
        type: "array",
        description: "List of key strengths extracted from the resume. Provide AT MOST 3 items. Do not include more than 3 strengths.",
        items: {
          type: "string"
        },
        maxItems: 3
      },

      weaknesses: {
        type: "array",
        description: "List of weaknesses or missing areas in the resume. Provide AT MOST 3 items. Do not include more than 3 weaknesses.",
        items: {
          type: "string"
        },
        maxItems: 3
      },

      suggestedSkills: {
        type: "array",
        description: "Skills or technologies the candidate should consider adding or improving.",
        items: {
          type: "string"
        }
      },

      suggestedExperience: {
        type: "array",
        description: "Suggested projects, internships, or experience areas that would strengthen the resume.",
        items: {
          type: "string"
        }
      },

      formattingFeedback: {
        type: "string",
        description: "Brief feedback on resume formatting, clarity, and structure."
      },

      overallScore: {
        type: "number",
        description: "Overall resume quality score between 0 and 10 .Keep the scoring STRICT",
        minimum: 0,
        maximum: 10
      }
    },
    required: ["summary", "strengths", "weaknesses", "overallScore"],
  };

  const resumeChunks = await AiDocument.find({
    userId: userID,
    docType: "resume",
  }).sort({ chunkIndex: 1 });

  if (!resumeChunks.length) {
    throw new Error("No resume found");
  }

  const fullResumeText = resumeChunks
    .map(chunk => chunk.chunkText)
    .join("\n");

  const response = await genaiClient.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Analyze the following resume and return ONLY a JSON object
that strictly follows the provided schema.

Be a strict, critical reviewer — act like a demanding hiring manager, not a
cheerleader. Do not be lenient or give the benefit of the doubt. Call out
real weaknesses, vague claims, and missing quantifiable impact even if the
resume looks decent overall. Reserve high scores only for genuinely
exceptional resumes.

Resume:
${fullResumeText}
`,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      responseJsonSchema: analysisSchema,
    },
  });

  return JSON.parse(response.text);
};

export default analyzeResume;