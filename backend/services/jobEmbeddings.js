import AiDocument from "../models/aiDocument.js";
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters'
import { embedTexts } from "../utils/huggingfaceEmbeddings.js";

export const jobEmbeddings = async (job,userID) => {
    const jobText = `Job Title: ${job.title} Job Description:${job.description} Job Requirements:${job.requirements}`;

    const splitter=new RecursiveCharacterTextSplitter({
        chunkSize:400,
        chunkOverlap:50
    })

    const docs=await splitter.createDocuments([jobText])

    const chunkTexts = docs.map(doc => doc.pageContent)
    const vectors = await embedTexts(chunkTexts)

   const records=[]

   for(let i=0;i<docs.length; i++){
        records.push({
            jobId:job._id,
            userId: userID,
            docType: "job",
            chunkText: chunkTexts[i],
            chunkIndex: i,
            embedding: vectors[i]
    });


   }
   await AiDocument.insertMany(records)

    return { chunksStored: records.length };

}
