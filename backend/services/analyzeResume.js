import AiDocument from "../models/aiDocument.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const analyzeResume = async (userID) => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.3,
  });

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
}
,
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

  const structuredModel = model.withStructuredOutput(analysisSchema);

  const result = await structuredModel.invoke(`
Analyze the following resume and return ONLY a JSON object
that strictly follows the provided schema.

Resume:
${fullResumeText}
`);

  return result;
};

export default analyzeResume;
