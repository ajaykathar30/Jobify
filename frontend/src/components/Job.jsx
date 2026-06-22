import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar,AvatarImage } from './ui/avatar'
import { Badge } from "@/components/ui/badge";
import {useNavigate} from "react-router-dom"
import { PinIcon } from 'lucide-react';
import { MapPinCheck } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { BriefcaseBusiness } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
// import { AvatarImage } from '@radix-ui/react-avatar'
// const JobId="qrefsvxf3wrsdfb"
const Job = ({job}) => {
  const {user}=useSelector(store=>store.auth)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const daysAgo=(mongodbTime)=>{
    const createdAt=new Date(mongodbTime)
    const currTime=new Date()
    const timeDiff=currTime-createdAt
    return Math.floor(timeDiff/(24*60*60*1000))
  }
  const handleClick=()=>{
    if(user===null){
      toast.info("Please Login/Signup first")
    }
    else{
      navigate(`/description/${job._id}`)
    }
   }
  const isSaved=user?.profile?.savedJobs?.some(id=>id?.toString?.()===job?._id?.toString?.())
  const handleToggleSave=async(e)=>{
    e.stopPropagation()
    if(user===null){
      toast.info("Please Login/Signup first")
      return
    }
    try {
      const res=await axios.post(`${USER_API_END_POINT}/savedJobs/${job._id}/toggle`,{},{withCredentials:true})
      if(res.data.success){
        dispatch(setUser({...user, profile:{...user.profile, savedJobs:res.data.savedJobs}}))
      }
    } catch (error) {
      console.log(error)
    }
  }
  const diff=daysAgo(job?.createdAt)
  return (
    <div onClick={handleClick } className='relative border shadow-md px-5 py-1 rounded-xl bg-white hover:shadow-xl'>
        <button onClick={handleToggleSave} className='absolute top-3 right-3 cursor-pointer'>
          <Bookmark className={isSaved ? 'fill-emerald-600 text-emerald-600' : 'text-gray-400'} />
        </button>
        <div className='flex justify-between items-center'>

     <p className='text-xs my-1'>{

            diff==='0'?"Today":`${diff} days ago`
     } </p>

        </div>
     <div className='flex gap-2 items-center'>
    {/* <Button className="h-30 w-auto" variant='outline' >
        <Avatar>
            <AvatarImage src={job?.company?.logo ||"/cl.png"}/>
        </Avatar>
     </Button> */}
     <img src={job?.company?.logo ||"/cl.png"} alt="companyLogo" srcset=""  className='h-15 w-15 border-2 rounded-xl'/>
     <div className='p-2 space-y-1  w-full'>
        {/* <h1 className='font-poppins text-xl'>{job?.company?.name}</h1> */}
        <h1 className='text-xl  '>{job?.title}</h1>

        
        {/* <p className='font-poppins text-muted-foreground text-sm'>{job?.company?.name}</p> */}
        <div className='flex space-x-2'>
          <p className='font-bold'>{job?.company?.name}</p>
          <Badge className=' bg-sky-100  text-black'>{job?.jobType}</Badge>
          
          </div>

     </div>
     </div>
     <div>
        {/* <p className='font-bold p-3'>{job?.location}</p> */}
        <p className='text-sm text-muted-foreground'>{job?.description.slice(0,100)+"..."}</p>
     </div>
    <div className='flex flex-wrap gap-2 my-2 font-poppins'>
        <Badge className='text- bg-emerald-200 text-black  '><BriefcaseBusiness /> {job?.vacancy} POSITIONS</Badge>
            <Badge className='text- bg-sky-200 text-black'><MapPin />{job?.location}</Badge>
            <Badge className='text- bg-teal-200 text-black'><IndianRupee />{job?.salary} LPA</Badge>
            {/* <Badge className='text- bg-green-600 text-white'>{job?.location}</Badge> */}
            {job?.deadline && <Badge className='text- bg-amber-100 text-amber-800'>Apply by {job.deadline.split('T')[0]}</Badge>}
    </div>
    </div>
  )
}

export default Job
