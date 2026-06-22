import mongoose from "mongoose"
import Job from "../models/job.js"
import { jobEmbeddings } from "../services/jobEmbeddings.js"
// to be posted by admin
export const postJob=async (req ,res)=>{
    try{
        const {title,description,salary,experience,location,jobType,requirements,companyId,vacancy,deadline}=req.body
        const userId=req.id
       if (!title) {
    return res.status(400).json({ message: "Job title is required", success: false });
}

if (!description) {
    return res.status(400).json({ message: "Job description is required", success: false });
}

if (!salary) {
    return res.status(400).json({ message: "Salary is required", success: false });
}

if (!experience) {
    return res.status(400).json({ message: "Experience is required", success: false });
}

if (!location) {
    return res.status(400).json({ message: "Job location is required", success: false });
}

if (!jobType) {
    return res.status(400).json({ message: "Job type is required", success: false });
}

if (!requirements) {
    return res.status(400).json({ message: "Job requirements are required", success: false });
}

if (!companyId) {
    return res.status(400).json({ message: "Company ID is required", success: false });
}

if (!vacancy) {
    return res.status(400).json({ message: "Number of vacancies is required", success: false });
}

        const job=await Job.create({
            title,
            description,
            salary,
            experienceLevel:experience,
            jobType,
            requirements,
            location,
            created_by:userId,
            company:companyId,
            vacancy,
            deadline:deadline || null
        })

        const len=await jobEmbeddings(job,userId);
        console.log(len)

        return res.status(201).json({message:"job created successfully",job,success:true})

    }catch(error){
         console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}
// to be fetched by students 
export const getAlljob=async(req,res)=>{
    try{
        const keyword=req.query.keyword || ""
        const location=req.query.location || ""
        const minSalary=req.query.minSalary
        const maxSalary=req.query.maxSalary
        const now=new Date()
        const andConditions=[
            {$or:[
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]},
            {status:{$ne:"closed"}},
            {$or:[
                {deadline:null},
                {deadline:{$gt:now}}
            ]}
        ]
        if(location){
            andConditions.push({location:{$regex:location,$options:"i"}})
        }
        if(minSalary || maxSalary){
            const salaryFilter={}
            if(minSalary) salaryFilter.$gte=Number(minSalary)
            if(maxSalary) salaryFilter.$lte=Number(maxSalary)
            andConditions.push({salary:salaryFilter})
        }
        const query={$and:andConditions}
        const jobs=await Job.find(query).populate({
            path:"company", // this means there is a company field in job model

        }).sort({createdAt:-1})
        
        if(!jobs){
            return res.status(404).json({message:"job not found",success:false})
        }

        return res.status(200).json({jobs,success:true})

    }catch(error){
          console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}
//to be fetched by students
export const getJobById=async(req,res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }
    try{
        const jobId=req.params.id
        const job=await Job.findById(jobId).populate({
            path:"company", // this meanas there is a company field in job model

        }).populate(
            {path:"applications",})
        if(!job){
            return res.status(404).json({message:"job not found",success:false})
        }
        return res.status(200).json({job ,success:true})
    }catch(error){
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}

// admin who has created job till now
export const getAdminJobs=async(req,res)=>{
    try{
        const adminId=req.id
        const jobs=await Job.find({created_by:adminId}).populate({
            path:'company'
        }).sort({createdAt:-1});
        if(!jobs){
            return res.status(404).json({message:"jobs not found",success:false})
        }
        return res.status(200).json({jobs ,success:true})
    }catch(error){
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}

// recruiter manually opens/closes one of their own jobs
export const updateJobStatus=async(req,res)=>{
    try{
        const {status}=req.body
        if(!['open','closed'].includes(status)){
            return res.status(400).json({message:"status must be 'open' or 'closed'",success:false})
        }
        const job=await Job.findById(req.params.id)
        if(!job){
            return res.status(404).json({message:"Job not found",success:false})
        }
        if(job.created_by.toString()!==req.id){
            return res.status(403).json({message:"Not authorized to update this job",success:false})
        }
        job.status=status
        await job.save()
        return res.status(200).json({message:`Job marked as ${status}`,success:true,job})
    }catch(error){
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}