import User from "../models/user.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"

export const register = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, role } = req.body
        if (!name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "please fill out all the fields !! ", success: false })
        }
        const file=req.file 
        console.log("Received file in backend:", req.file);
        const fileUri=getDataUri(file)
        const cloudResponse=await cloudinary.uploader.upload(fileUri)

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists . Use different email ", success: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
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
            res.status(400).json({ message: 'please fill all the fields', success: false })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exists register first ", success: false })
        }
        const isvalidUser = await bcrypt.compare(password, user.password)
        if (!isvalidUser) {
            return res.status(400).json({ message: 'incorrect email or password ,try again !!' })
        }

        if (role != user.role) {
            return res.status(400).json({ message: 'Account does not exists with current role !!  ' })
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
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None',secure:true }).json({ message: `Welcome ${(user.name).toUpperCase()}`, success: true, user })

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
        if(file){
            try {
        fileUri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileUri);
    } catch (cloudErr) {
        console.error("Cloudinary error:", cloudErr);
        return res.status(500).json({ message: "Error uploading file", success: false });
    }
            // console.log("Uploaded File:", req.file);


            // fileUri=getDataUri(file)
            //  cloudResponse=await cloudinary.uploader.upload(fileUri)
        }
        //cloudinary will come here...

        const skillsArray = skills.split(",")
        const userID = req.id //middleware auth
        let user = await User.findById(userID)
        if (!user) {
            return res.status(400).json({ message: "User not found ", success: false })
        }
        user.name = name
        user.email = email
        user.phoneNumber = phoneNumber
        user.profile.skills = skillsArray
        user.profile.bio = bio
        // resume to added later 
        if(cloudResponse){
            user.profile.resume=cloudResponse.secure_url
            user.profile.resumeOriginalName=file.originalname
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
        return res.status(200).json({ message: 'profile updated successfully ', user, success: true })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });



    }
    finally{

    }
}
