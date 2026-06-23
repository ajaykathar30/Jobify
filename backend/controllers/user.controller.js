import User from "../models/user.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"
import { resumeVectorEmbeddingsFromUrl } from "../services/resumeEmbeddingService.js"
import AiDocument from "../models/aiDocument.js"
export const register = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, role } = req.body
        if (!name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "please fill out all the fields !!", success: false })
        }
        const file = req.file
        let fileUri;
        let cloudResponse = "";
        // if(!file){
        //     return res.status(400).json({success:false, message:"Please upload profile pic"})
        // }
        if (file) {
            console.log("Received file in backend:", req.file);
            fileUri = getDataUri(file)
            cloudResponse = await cloudinary.uploader.upload(fileUri, { resource_type: "raw" })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(409).json({ message: "User already exists . Use different email ", success: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        })
        return res.status(201).json({ message: 'Account Created successfully ', success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'please fill all the fields', success: false })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "User does not exists register first ", success: false })
        }
        const isvalidUser = await bcrypt.compare(password, user.password)
        if (!isvalidUser) {
            return res.status(401).json({ message: 'incorrect email or password ,try again !!', success: false })
        }

        if (role != user.role) {
            return res.status(401).json({ message: 'Account does not exists with current role !!  ', success: false })
        }
        const tokenData = {
            userID: user._id
        }
        user = {
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profile: user.profile
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true }).json({ message: `Welcome ${(user.name).toUpperCase()}`, success: true, user })

    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "logged out successfully", success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });


    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, email, phoneNumber, skills, bio } = req.body

        const file = req.file //to be understood 
        if (!name || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({ message: "please fill out all the fields !! ", success: false })
        }
        let fileUri, cloudResponse;
        if (file) {
            try {
                fileUri = getDataUri(file);
                cloudResponse = await cloudinary.uploader.upload(fileUri, { resource_type: "raw" });
            } catch (cloudErr) {
                console.error("Cloudinary error:", cloudErr);
                return res.status(500).json({ message: "Error uploading file", success: false });
            }
        }

        const skillsArray = skills.split(",")
        const userID = req.id // from middleware auth
        let user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({ message: "User not found ", success: false })
        }
        user.name = name
        user.email = email
        user.phoneNumber = phoneNumber
        user.profile.skills = skillsArray
        user.profile.bio = bio

        let resumeProcessingFailed = false
        if (cloudResponse) {
            try {
                // Create the new embedding before touching the old one - if this
                // throws, the user's existing working resume/embedding is untouched.
                await resumeVectorEmbeddingsFromUrl(cloudResponse.secure_url, userID)
                const resumeDocs = await AiDocument.find({ userId: userID, docType: "resume" }).sort({ createdAt: -1 })
                const staleIds = resumeDocs.slice(1).map(d => d._id)
                if (staleIds.length) {
                    await AiDocument.deleteMany({ _id: { $in: staleIds } })
                }
                user.profile.resume = cloudResponse.secure_url
                user.profile.resumeOriginalName = file.originalname
            } catch (resumeErr) {
                console.error("Resume processing failed:", resumeErr)
                resumeProcessingFailed = true
            }
        }

        await user.save()

        user = {
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profile: user.profile
        }
        return res.status(200).json({
            message: resumeProcessingFailed
                ? "Profile updated, but we couldn't process that resume file. Please try a different PDF."
                : 'profile updated successfully ',
            user,
            success: true,
            resumeProcessingFailed
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });



    }
    finally {

    }
}

export const toggleSavedJob = async (req, res) => {
    try {
        const userId = req.id
        const jobId = req.params.jobId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }
        const alreadySaved = user.profile.savedJobs.some(id => id.toString() === jobId)
        if (alreadySaved) {
            user.profile.savedJobs = user.profile.savedJobs.filter(id => id.toString() !== jobId)
        } else {
            user.profile.savedJobs.push(jobId)
        }
        await user.save()
        return res.status(200).json({
            message: alreadySaved ? "Job removed from saved jobs" : "Job saved",
            success: true,
            savedJobs: user.profile.savedJobs
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id
        const user = await User.findById(userId).populate({
            path: 'profile.savedJobs',
            populate: { path: 'company' }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }
        return res.status(200).json({ success: true, jobs: user.profile.savedJobs })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}
