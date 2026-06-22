import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'


import { MoreHorizontalIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSinglejob, setAllAdminJobs } from '@/redux/jobSlice'
import { Eye, Ban, RotateCcw } from 'lucide-react'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'


const AdminJobstable = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {allAdminJobs,searchJobsByText}=useSelector(store=>store.job)

  const [filterJobs, setfilterJobs] = useState(allAdminJobs)
  useEffect(() => {
      const  filteredJob= allAdminJobs?.length>0 && allAdminJobs.filter((job)=>{
        if(!searchJobsByText)return true
        return job?.title.toLowerCase().includes(searchJobsByText.toLowerCase())

      })
      setfilterJobs( filteredJob)
  }, [allAdminJobs,searchJobsByText])
  const handleEdit=(job)=>{
      dispatch(setSinglejob(job))
      navigate(`${job._id}`)
  }
  const handleApplicants=(job)=>{
     dispatch(setSinglejob(job))
      navigate(`${job._id}/applicants`)
  }
  const handleToggleStatus=async(job)=>{
    const newStatus=job.status==='closed'?'open':'closed'
    try {
      const res=await axios.post(`${JOB_API_END_POINT}/${job._id}/status/update`,{status:newStatus},{withCredentials:true})
      if(res.data.success){
        dispatch(setAllAdminJobs(allAdminJobs.map(j=>j._id===job._id?{...j,status:newStatus}:j)))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to update job status")
    }
  }

  return (
    <div>
      <Table className='my-5'>
        <TableCaption>A list of your recent posted jobs </TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>Company name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
            </TableRow>
        </TableHeader>
       <TableBody>
  {Array.isArray(filterJobs) && filterJobs.length > 0 ? (
    filterJobs.map((job, idx) => (
      <TableRow key={idx}>
        <TableCell>
         {job?.company?.name}
        </TableCell>
        <TableCell>{job?.title}</TableCell>
        <TableCell>
          <Badge variant="secondary" className={job?.status==='closed'?'bg-red-50 text-red-700':'bg-emerald-50 text-emerald-700'}>
            {job?.status==='closed'?'Closed':'Open'}
          </Badge>
        </TableCell>
        <TableCell>{job?.deadline?.split('T')[0] || 'No deadline'}</TableCell>
        <TableCell>{job?.createdAt?.split('T')[0]}</TableCell>
        <TableCell className="cursor-pointer">
          <Popover>
            <PopoverTrigger>
              <MoreHorizontalIcon />
            </PopoverTrigger>
            <PopoverContent className="w-36">
              <div className="flex gap-2 mt-2 w-fit cursor-pointer items-center">
                  <Eye className='w-4'/>
                <span onClick={()=>{handleApplicants(job)}}>Applicants</span>
              </div>
              <div className="flex gap-2 mt-2 w-fit cursor-pointer items-center">
                  {job?.status==='closed'?<RotateCcw className='w-4'/>:<Ban className='w-4'/>}
                <span onClick={()=>{handleToggleStatus(job)}}>{job?.status==='closed'?'Reopen Job':'Close Job'}</span>
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={6} className="text-center">
        No jobs to display
      </TableCell>
    </TableRow>
  )}
</TableBody>


      </Table>
      <ToastContainer autoClose={1000} theme="dark"/>
    </div>
  )
}

export default AdminJobstable
