import mongoose from 'mongoose';
const { Schema } = mongoose;

const jobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String },
  salary: { type: Number, required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  experienceLevel: { type: Number, required: true },
  vacancy: { type: Number, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company' //this is model name  ==> const Company=mongoose.model('Company',companySchema)
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  deadline: { type: Date, default: null },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
},{timestamps:true});

const Job = mongoose.model('Job', jobSchema);
export default Job;
