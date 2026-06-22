import axios from "axios";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embedTexts, meanPoolVectors } from "../utils/huggingfaceEmbeddings.js";
import AiDocument from "../models/aiDocument.js";

// Conservative proxy for all-mpnet-base-v2's ~384-token limit. Resume text
// tokenizes denser than plain prose (proper nouns, acronyms, dates), so we
// stay well under the naive ~4-chars/token estimate to avoid silent truncation.
const SAFE_SINGLE_CHUNK_CHARS = 1200;

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

  let pieces;
  if (text.length <= SAFE_SINGLE_CHUNK_CHARS) {
    pieces = [text];
  } else {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100
    });
    const docs = await splitter.createDocuments([text]);
    pieces = docs.map(doc => doc.pageContent);
  }

  const vectors = await embedTexts(pieces);
  const pooledEmbedding = meanPoolVectors(vectors);

  // Save a single pooled embedding for the whole resume
  await AiDocument.insertMany([{
    userId,
    docType: "resume",
    chunkIndex: 0,
    chunkText: text,
    embedding: pooledEmbedding
  }]);

  return { chunksStored: 1 };
};
