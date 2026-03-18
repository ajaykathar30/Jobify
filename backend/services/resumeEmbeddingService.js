import axios from "axios";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import AiDocument from "../models/aiDocument.js";

export const resumeVectorEmbeddingsFromUrl = async (resumeUrl, userId) => {
  // 1️⃣ Download PDF from Cloudinary
  const res = await axios.get(resumeUrl, {
    responseType: "arraybuffer"
  });

  const buffer = Buffer.from(res.data);

  // Parse PDF
  const data = await pdf(buffer);
  const text = data.text.replace(/\s+/g, " ").trim();

  if (!text || text.length < 100) {
    throw new Error("Resume text too short");
  }

  // Chunk text
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100
  });

  const docs = await splitter.createDocuments([text]);

  // Embeddings model
  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY,
    model: "sentence-transformers/all-mpnet-base-v2"
  });

  // Create vector docs
  const records = [];

  for (let i = 0; i < docs.length; i++) {
    const chunkText = docs[i].pageContent;
    const vector = await embeddings.embedQuery(chunkText);

    records.push({
      userId,
      docType: "resume",
      chunkIndex: i,
      chunkText,
      embedding: vector
    });
  }

  // Save
  await AiDocument.insertMany(records);

  return { chunksStored: records.length };
};
