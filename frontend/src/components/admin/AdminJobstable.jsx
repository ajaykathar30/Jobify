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


import { MoreHorizontalIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSinglejob } from '@/redux/jobSlice'
import { Eye } from 'lucide-react'


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
  
  return (
    <div>
      <Table className='my-5'>
        <TableCaption>A list of your recent posted jobs </TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>Company name</TableHead>
                <TableHead>Role</TableHead>
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
        <TableCell>{job?.createdAt?.split('T')[0]}</TableCell>
        <TableCell className="cursor-pointer">
          <Popover>
            <PopoverTrigger>
              <MoreHorizontalIcon />
            </PopoverTrigger>
            <PopoverContent className="w-32">
              <div className="flex gap-2 mt-2 w-fit cursor-pointer items-center">
                  <Eye className='w-4'/>
                <span onClick={()=>{handleApplicants(job)}}>Applicants</span>
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={4} className="text-center">
        No jobs to display
      </TableCell>
    </TableRow>
  )}
</TableBody>


      </Table>
    </div>
  )
}

export default AdminJobstable
