import mongoose from "mongoose";

const { Schema } = mongoose;

const aiDocumentSchema = new Schema(
  {
    // ── ownership ─────────────────────────
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      index: true,
      default: null
    },

    // ── document type ─────────────────────
    docType: {
      type: String,
      enum: ["resume", "job"],
      required: true,
      index: true
    },

    // ── chunking ──────────────────────────
    chunkIndex: {
      type: Number,
      required: true
    },

    chunkText: {
      type: String,
      required: true
    },

    // ── vector ────────────────────────────
    embedding: {
      type: [Number], // 768-d for mpnet
      required: true
    },

    // ── extensible metadata ───────────────
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

const AiDocument = mongoose.model("AiDocument", aiDocumentSchema);

export default AiDocument;
