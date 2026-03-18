import AiDocument from "../models/aiDocument.js"
import Job from "../models/job.js"
export const rankApplicants=async (jobId)=>{
    const job=await Job.findById(jobId).populate({
        path:'applications',
        
            populate:{path:'applicant'}
        
    });

    if(!job){
        throw new Error("Job not found")
    }

    const applicantIds=job.applications.map((app)=>app.applicant._id
    )

    const jobDocs=await AiDocument.find({
        'jobId':jobId,
        'docType':"job"
    })

    if (!jobDocs.length) {
        throw new Error("Job embeddings not found");
    }

    const resumeDocs=await AiDocument.find({
        userId:{$in:applicantIds},
        docType:"resume"
    })

   // Group resume chunks by user
    const resumeMap = {};
    for (const doc of resumeDocs) {
        const uid=doc.userId.toString()
        if (!resumeMap[uid]) resumeMap[uid] = [];
        resumeMap[uid].push(doc.embedding);
    }

    const ranked = [];

    // 3. Score each applicant
    for (const userId of applicantIds) {
        const uid = userId.toString();

        const resumeEmbeddings = resumeMap[uid];

        // 0 score if no resume
        if (!resumeEmbeddings) {
            ranked.push({ userId, score: 0 });
            continue;
        }

        let bestScore = 0;

        for (const jobChunk of jobDocs) {
            for (const resumeChunk of resumeEmbeddings) {
                const score = cosineSimilarity(
                    jobChunk.embedding,
                    resumeChunk
                );
                bestScore = Math.max(bestScore, score);
            }
        }

        ranked.push({ userId, score: bestScore });
    }

    // 4. Sort descending by relevance
    ranked.sort((a, b) => b.score - a.score);
    // console.log(ranked)
    return ranked;
   
    
}

export function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB) return 0;
    if (vecA.length !== vecB.length) {
        throw new Error("Vector dimensions do not match");
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
