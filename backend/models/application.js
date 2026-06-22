import mongoose from 'mongoose';
const { Schema } = mongoose;

const applicationSchema = new Schema({
  job:{type:mongoose.Schema.Types.ObjectId,ref:'Job',required:true},
  applicant:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  status: {
  type: String,
  enum: ['pending', 'rejected', 'accepted'],
  default: 'pending'
},
  aiRerank: {
    score: { type: Number },
    matchedRequirements: { type: [String], default: [] },
    missingRequirements: { type: [String], default: [] },
    reasoning: { type: String },
    rerankedAt: { type: Date }
  }

},{timestamps:true});
const Application =mongoose.model('Application',applicationSchema)
export default Application;