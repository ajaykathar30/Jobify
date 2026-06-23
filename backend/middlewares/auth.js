import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const isAuth=async(req ,res,next)=>{
     try{
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({message:"Please Login/Signup ",success:false})
        }
        const decode=jwt.verify(token,process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({message:"invalid token ",success:false})
        }
        req.id=decode.userID
        next()
     }catch(error){
        console.error(error)
    return res.status(401).json({ message: "Invalid or expired token", success: false })

     }
}

export const restrictTo=(...allowedRoles)=>async(req,res,next)=>{
    try{
        const user=await User.findById(req.id)
        if(!user || !allowedRoles.includes(user.role)){
            return res.status(403).json({message:"Not authorized",success:false})
        }
        next()
    }catch(error){
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export default isAuth