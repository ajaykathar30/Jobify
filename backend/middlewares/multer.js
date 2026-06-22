import multer from 'multer'
const storage=multer.memoryStorage()
export const singleUpload=multer({storage}).single("file")

const resumeMulter=multer({
    storage,
    limits:{fileSize:1*1024*1024}, // 1MB
    fileFilter:(req,file,cb)=>{
        if(file.mimetype==='application/pdf'){
            cb(null,true)
        }else{
            cb(new Error('Only PDF files are allowed'))
        }
    }
}).single("file")

export const resumeUpload=(req,res,next)=>{
    resumeMulter(req,res,(err)=>{
        if(err){
            const message=err.code==='LIMIT_FILE_SIZE'
                ?'Resume file must be under 1MB'
                :'Only PDF files are allowed'
            return res.status(400).json({message,success:false})
        }
        next()
    })
}
