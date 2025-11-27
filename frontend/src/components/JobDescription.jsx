
import React from 'react'
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState } from 'react';
import Navbar from './shared/Navbar';
// import useGetSingleJob from './hooks/useGetSingleJob';
import { setSinglejob } from "@/redux/jobSlice"
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
const JobDescription = () => {

    const params=useParams()
    const id=params.id    
    // console.log(id)
    const {singleJob}=useSelector(store=>store.job)
    const dispatch=useDispatch() 
    const {user}=useSelector(store=>store.auth)
    const isInitiallyApplied=singleJob?.applications?.some((application)=>application.applicant===user?._id)|| false;
    const [isApplied, setisApplied] = useState(isInitiallyApplied)
    const handleApply=async ()=>{
          try {
            // console.log('hi')
              const res=await axios.get(`${APPLICATION_API_END_POINT}/apply/${id}`,{withCredentials:true})
              // console.log(res.data)
              if(res.data.success){
                setisApplied(true)
                const updatedSingleJob={...singleJob,applications:[...singleJob.applications,{applicant:user.id}]}
                dispatch(setSinglejob(updatedSingleJob))
                toast.success(res.data.message)

              }
              else{
                toast.error(res.data.message)
              }

          } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
          }
    }
    useEffect(() =>  {
  const fetchData=async ()=>{
  try {
       const res=await axios.get(`${JOB_API_END_POINT}/get/${id}`,{withCredentials:true})
      if(res.data.success){
        console.log(user?._id)
          dispatch(setSinglejob(res.data.job))
          setisApplied(res.data.job.applications.some((application)=>application.applicant===(user?._id)))
      }
      const Job=res.data.job
      // setjobs(Job)
      console.log(Job)
    } catch (error) {
      console.log(error)
    }
  }
  fetchData()
}, [id,dispatch,user?._id])
//  const isApplied=false;

  return (
    <>
    <Navbar/>
{
  singleJob?
    <div className='max-w-5xl mx-auto my-10 border-2 p-5 rounded-b-3xl rounded-tr-3xl shadow-md bg-cover bg-center '>
        <div className='flex items-center justify-between'>
      <div className='my-3'>
        <h1 className='text-2xl font-bold '>{singleJob.title}</h1>
        <div className='flex items-center gap-2 my-2'>
                <Badge className='bg-teal-500'>{singleJob.vacancy} positions</Badge>
                <Badge  className='bg-emerald-500'>{singleJob.salary}LPA</Badge>
                <Badge className='bg-cyan-600'>{singleJob.jobType}</Badge>
        </div>
        </div>
      {
        isApplied?
        <Button className='bg-gray-400 cursor-not-allowed'>Already Applied</Button>:
        <Button className='bg-emerald-500 cursor-pointer' onClick={handleApply}>Apply Now</Button>
      }
      </div>
      <hr className=''/>
      <div>
       <div className='bg-[url("/brushBb.png")] bg-cover bg-center w-fit my-5 '>
      <h1 className='text-left text-xl uppercase font-black italic mx-7 text-white  leading-normal'>
        Job Description
      </h1>
      
    </div>
        <div className='flex flex-col justify-start'>
            <h1 className='my-3 font-bold '>Position-<span className='text-muted-foreground font-poppins px-2'>{singleJob.title}</span></h1>
            <h1  className='my-3 font-bold '>Location-<span className='text-muted-foreground font-poppins px-2'>{singleJob.location}</span></h1>
            <h1 className='my-3 font-bold '>Description<span className='text-muted-foreground font-poppins px-2'>{singleJob.description}</span></h1>
            <h1 className='my-3 font-bold '>Total Applicants-<span className='text-muted-foreground font-poppins px-2'>{singleJob?.applications.length}</span></h1>
            <h1 className='my-3 font-bold '>Salary-<span className='text-muted-foreground font-poppins px-2'>{singleJob.salary}LPA</span></h1>
            <h1 className='my-3 font-bold '>Posted on-<span className='text-muted-foreground font-poppins px-2'>{singleJob?.createdAt?.split('T')[0]||'N/A'}</span></h1>
        </div>
      </div>
    </div>:<div>loading...</div>
}

      </>
  )
}

export default JobDescription
