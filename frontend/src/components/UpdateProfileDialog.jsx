import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from './ui/dialog'
import { USER_API_END_POINT } from '@/utils/constant';
import { Label } from './ui/label'
import { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
const UpdateProfileDialog = ({open,setopen}) => {
    const dispatch=useDispatch()
    const [loading, setLoading] = useState(false)
    const {user}=useSelector(store=>store.auth)
    const [input, setinput] = useState({
        fullname:user?.name,
         email:user?.email,
         number:user?.phoneNumber,
         bio:user?.profile?.bio,
         skills:user?.profile?.skills?.map((item)=>item),
         file:user?.profile?.resume
    })
const handleChange=(e)=>{
    setinput((prev)=>({...prev,[e.target.name]:e.target.value}))
}
const handleSubmit=async (e)=>{
    e.preventDefault()
    const formData=new FormData()
    formData.append("name",input.fullname)
    formData.append("email",input.email)
    formData.append("phoneNumber",input.number)
    formData.append("bio",input.bio)
    formData.append("skills",input.skills)
    if(input.file)
    formData.append("file",input.file)

    try {
        setLoading(true)
        const res=await axios.post(`${USER_API_END_POINT}/profile/update`,formData,{
            headers:{
                 'Content-Type':'multipart/form-data',
            },
            withCredentials:true
        })

          if(res.data.success){
        dispatch(setUser(res.data.user))
        toast.success(res.data.message)
    }
    else {
        toast.error(res.data.message)
    }
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)

    }
    finally{
        setLoading(false)
    }
    setopen(false)
    console.log(input)
  

}
 const handlefile=(e)=>{
    const file=e.target.files?.[0]
      setinput((prev)=>({...prev,file}))
  }
  return (
   <div>
    <Dialog open={open} onOpenChange={()=>setopen(false)}>
            <DialogContent className='sm:max-w-[425px]' onInteractOutside={()=>setopen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-4'>
                        
                        <Label htmlFor='name' className='text-right'>Name</Label>
                        
                        <input type="text" id='name'
                        name='fullname'
                        value={input.fullname}
                        onChange={handleChange}
                        className='p-1 border-2 outline-0 my-1 rounded col-span-3'/>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4 mb-3'>
                        
                        <Label htmlFor='email' className='text-right'>Email</Label>
                        <input type="email " name='email' value={input.email} id='email'  onChange={handleChange} className='p-1 border-2 outline-0 my-1 rounded col-span-3'/>
                    </div>
                    <div className='grid grid-cols-4'>
                        
                        <Label htmlFor='number' className='text-right'>Number</Label>
                        <input type="text" id='number' name='number' value={input.number}  onChange={handleChange} className='p-1 border-2 outline-0 my-1 rounded col-span-3'/>
                    </div>
                    <div className='grid grid-cols-4'>
                        
                        <Label htmlFor='bio' className='text-right'>Bio</Label>
                        <input type="text" id='bio' name='bio' value={input.bio}   onChange={handleChange}className='p-1 border-2 outline-0 my-1 rounded col-span-3'/>
                    </div>
                    <div className='grid grid-cols-4'>
                        
                        <Label htmlFor='skills' className='text-right'>Skills</Label>
                        <input type="text" id='skills' name='skills' value={input.skills}  onChange={handleChange} className='p-1 border-2 outline-0 my-1 rounded col-span-3'/>
                    </div>
                    <div className='grid grid-cols-4'>
                        
                        <Label htmlFor='file' className='text-right'>Resume</Label>
                        <input type="file" id='file'name='file'  onChange={handlefile} accept='application/pdf' className='p-1 border-2 outline-0 my-1 rounded col-span-3'/>
                    </div>
                    <DialogFooter>

                    {
                                 (loading)?<Button type='submit' variant="outline" className="mb-5 w-full " ><Loader2 className='animate-spin h-4 w-4 mr-2'/>Please wait</Button>: <Button variant="outline" className="mb-5 w-full hover:text-white hover:bg-gradient-to-r hover:from-[#2A7B9B] hover:via-[#57C785] hover:to-[#EDDD53] " type='submit'>Update</Button>
                    }
                    </DialogFooter>
                </form>
            </DialogContent>
    </Dialog>

   </div>
  )
}

export default UpdateProfileDialog
