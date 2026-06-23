import Company from "../models/company.js"
import cloudinary from "../utils/cloudinary.js"
import getDataUri from "../utils/datauri.js"
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body
        let company = await Company.findOne({ name: companyName })
        if (!companyName) {
            return res.status(400).json({ message: "Company name is required", success: false })
        }
        if (company) {
            return res.status(409).json({ message: "You cant register same company ", success: false })
        }
        company = await Company.create({
            name: companyName,
            userId: req.id,

        })
        return res.status(201).json({ message: 'Company registered successfully', company, success: true })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}

export const getCompany = async (req, res) => {
    try {
        const userId=req.id
        const companies=await Company.find({userId})
        if(!companies){
            return res.status(404).json({message:"No company registered ! ! ",success:false})
        }
        return res.status(200).json({message:"companies found successfully ",companies,success:true})

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}
export const getCompanyById = async (req, res) => {
    try {
        const companyId=req.params.id
        const company=await Company.findById(companyId)
        if(!company){
            return res.status(404).json({message:"No company registered ! ! ",success:false})
        }
        return res.status(200).json({message:"company found  ",company,success:true})

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}
export const updateCompany = async (req, res) => {
    try {
        console.log("trying")
        const {name,description,website,location}=req.body
        const file=req.file

        let fileUri,cloudResponse
        if(file){
            try {
                 fileUri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileUri);
            } catch (error) {
                 console.error("Cloudinary error:", error);
        return res.status(500).json({ message: "Error uploading file", success: false });
            }
        }
       

        //here cloudinary will come
        const companyId=req.params.id
        const updatedData={name,description,website,location,logo:cloudResponse?.secure_url}
        const company=await Company.findByIdAndUpdate(companyId,updatedData,{new:true})
        if(!company){
            return res.status(404).json({message:"No company registered ! ! ",success:false})
        }

        return res.status(200).json({message:"company info updated",company,success:true})

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })

    }
}
