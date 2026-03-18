import AiDocument from "../models/aiDocument.js";
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters'
import {HuggingFaceInferenceEmbeddings} from '@langchain/community/embeddings/hf'

export const jobEmbeddings = async (job,userID) => {
    const jobText = `Job Title: ${job.title} Job Description:${job.description} Job Requirements:${job.requirements}`;

    const splitter=new RecursiveCharacterTextSplitter({
        chunkSize:400,
        chunkOverlap:50
    })

    const docs=await splitter.createDocuments([jobText])

     const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY,
    model: "sentence-transformers/all-mpnet-base-v2"
  });

   const records=[]

   for(let i=0;i<docs.length; i++){
        const chunkText=docs[i].pageContent

        const vector= await embeddings.embedQuery(chunkText)
        records.push({
            jobId:job._id,
            userId: userID,
            docType: "job",
            chunkText,
            chunkIndex: i,
            embedding: vector
    });


   }
   await AiDocument.insertMany(records)

    return { chunksStored: records.length };

}
