import AiDocument from "../models/aiDocument.js"
import Job from "../models/job.js"

const RRF_K = 10;
const VECTOR_INDEX_NAME = "resume_vector_index";

export const rankApplicants = async (jobId) => {
    const job = await Job.findById(jobId).populate({
        path: 'applications',
        populate: { path: 'applicant' }
    });

    if (!job) {
        throw new Error("Job not found")
    }

    const applicantIds = job.applications.map((app) => app.applicant._id)

    if (!applicantIds.length) {
        return [];
    }

    const jobDocs = await AiDocument.find({
        'jobId': jobId,
        'docType': "job"
    })

    if (!jobDocs.length) {
        throw new Error("Job embeddings not found");
    }

    // For each job chunk, ask Atlas Vector Search to rank this job's
    // applicants by resume similarity to that chunk.
    const perChunkResults = await Promise.all(
        jobDocs.map((jobDoc) =>
            AiDocument.aggregate([
                {
                    $vectorSearch: {
                        index: VECTOR_INDEX_NAME,
                        path: "embedding",
                        queryVector: jobDoc.embedding,
                        exact: true,
                        limit: applicantIds.length,
                        filter: {
                            docType: "resume",
                            userId: { $in: applicantIds }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userId: 1,
                        score: { $meta: "vectorSearchScore" }
                    }
                }
            ])
        )
    );

    // Fuse the per-chunk rankings with Reciprocal Rank Fusion.
    const rrfScores = {};
    for (const resultList of perChunkResults) {
        resultList.forEach((doc, idx) => {
            const uid = doc.userId.toString();
            rrfScores[uid] = (rrfScores[uid] || 0) + 1 / (RRF_K + idx + 1);
        });
    }

    const ranked = applicantIds.map((userId) => ({
        userId,
        score: rrfScores[userId.toString()] || 0
    }));

    ranked.sort((a, b) => b.score - a.score);

    return ranked;
}
