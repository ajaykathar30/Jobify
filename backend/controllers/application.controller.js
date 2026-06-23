import Application from '../models/application.js'
import Job from '../models/job.js'
import { rankApplicants } from '../services/rankApplicants.js'
import { rerankCandidates } from '../services/rerankCandidates.js'
import { normalizeScores } from '../utils/normalizeScores.js'
import { statusFromError } from '../utils/errorStatus.js'
// USER WANTS TO APPLY JOB
export const applyJob=async(req,res)=>{
    try{
        const userId=req.id
        const jobId=req.params.id
        if(!jobId){
            return res.status(400).json({message:"jobId is required",success:false})
        }
        const existingApplication=await Application.findOne({job:jobId,applicant:userId})
        if(existingApplication){
            return res.status(409).json({message:"u already applied for this job",success:false})
        }

        const job=await Job.findById(jobId)
        if(!job){
            return res.status(404).json({message:"Job not found",success:false})
        }
        const isJobOpen=job.status==="open" && (!job.deadline || job.deadline>new Date())
        if(!isJobOpen){
            return res.status(400).json({message:"This job is closed and no longer accepting applications",success:false})
        }
        const newApplication =await Application.create({
            job:jobId,
            applicant:userId,
        })
        job.applications.push(newApplication._id)
        await job.save()
        return res.status(201).json({message:"Application submitted successfully",application:newApplication,success:true})
    }catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}
// USER PROFILE PAGE APPLICATION TABLE
export const getApplications=async(req,res)=>{
    try{
        const userId=req.id
        const applications=await Application.find({applicant:userId}).sort({createdAt:-1})
        .populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:"company",
                options:{sort:{createdAt:-1}},
            }
        })
        return res.status(200).json({message: applications.length ? "Applications found" : "No applications yet",applications,success:true})
    }catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}
//  HERE WE FETCH JOB APPLICANTS FOR RECRUITER
// export const getApplicants = async (req, res) => {
//     try {
//         const jobId = req.params.id;
        // const job = await Job.findById(jobId).populate({
        //         path: 'applications',
        //         options: { sort: { createdAt: -1 } },
        //         populate:{
        //             path:'applicant'
        //         }
        //     });

//             if(!job){
//                 return res.status(404).json({
//                     message:"Job not found",
//                     success:false
//                 })
//             }
//              return res.status(200).json({
//                     success:true,
//                     job
//                 })
        
                

       
    

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };


export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
                path: 'applications',
                options: { sort: { createdAt: -1 } },
                populate:{
                    path:'applicant'
                }
            }).lean();
   
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    //  console.log(job)

    // 🔹 STEP 1: Get AI ranking
    const ranked = await rankApplicants(jobId);

    // 🔹 STEP 2: Build score map
    const scoreMap = {};
    ranked.forEach(r => {
      scoreMap[r.userId.toString()] = r.score;
    });

    // 🔹 STEP 3: Attach score to applications
   job.applications = job.applications.map(app => ({
  ...app,
  aiScore: scoreMap[app.applicant._id.toString()] || 0
}));

    // 🔹 STEP 3.5: Normalize aiScore into a 0-100 match % relative to this job's pool
    const normalizedScores = normalizeScores(job.applications, app => app.aiScore);
    job.applications = job.applications.map((app, i) => ({
      ...app,
      matchScore: normalizedScores[i]
    }));

    // 🔹 STEP 4: Sort by AI rerank score when available, otherwise the Stage-1 match score
    job.applications.sort((a, b) => (b.aiRerank?.score ?? b.matchScore) - (a.aiRerank?.score ?? a.matchScore));

    return res.status(200).json({
      success: true,
      job
    });

  } catch (error) {
    console.error(error);
    return res.status(statusFromError(error)).json({
      message: error.message || "Internal server error",
      success: false
    });
  }
};

export const rerankApplicantsController = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = await rerankCandidates(jobId);
    return res.status(200).json({
      success: true,
      message: `Reranked ${updates.length} candidate(s)`,
      rerankedCount: updates.length
    });
  } catch (error) {
    console.error(error);
    return res.status(statusFromError(error)).json({
      message: error.message || "Internal server error",
      success: false
    });
  }
};


export const updateApplicationStatus=async(req,res)=>{
    try{
        const {status}=req.body
        const applicationId=req.params.id
        if(!status || !applicationId){
            return res.status(400).json({message:"status and applicationId are required",success:false})
        }
        const application=await Application.findById(applicationId)
        if(!application){
            return res.status(404).json({message:"Application not found",success:false})
        }
        if(application.status===status){
            return res.status(200).json({message:"Status unchanged",application,success:true})
        }
        application.status=status
        await application.save()

        return res.status(200).json({message:"Application status updated successfully",application,success:true})
    }catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}
