import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverTrigger,PopoverContent } from '../ui/popover'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { MoreHorizontalIcon, Sparkles, Loader2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
const shortListingStatus=["accepted","rejected"]

const matchScoreBadgeClass = (score) => {
  if (score >= 70) return 'bg-emerald-50 text-emerald-700'
  if (score >= 40) return 'bg-amber-50 text-amber-700'
  return 'bg-gray-100 text-gray-600'
}

const statusBadgeClass = (status) => {
  if (status === 'accepted') return 'bg-emerald-50 text-emerald-700'
  if (status === 'rejected') return 'bg-red-50 text-red-700'
  return 'bg-gray-100 text-gray-600'
}

const ApplicantsTable = () => {
  const dispatch=useDispatch()
  const {allApplicants}=useSelector(store=>store.application)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [isReranking, setIsReranking] = useState(false)

  const statusHandler=async (status,id)=>{
    try {
      axios.defaults.withCredentials=true
        const res=await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`,{status})
        if(res.data.success){
          dispatch(setAllApplicants({
            ...allApplicants,
            applications: allApplicants.applications.map(app => app._id===id ? {...app, status} : app)
          }))
          toast.success(res.data.message)
        }
    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirm=async()=>{
    if(!confirmTarget) return
    await statusHandler(confirmTarget.status, confirmTarget.id)
    setConfirmTarget(null)
  }

  const handleRerank=async()=>{
    if(!allApplicants?._id || isReranking) return
    try {
      setIsReranking(true)
      await axios.post(`${APPLICATION_API_END_POINT}/${allApplicants._id}/rerank`,{},{withCredentials:true})
      const res=await axios.get(`${APPLICATION_API_END_POINT}/${allApplicants._id}/applicants`,{withCredentials:true})
      if(res.data.success){
        dispatch(setAllApplicants(res.data.job))
        toast.success("Re-ranked top candidates with AI")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Rerank failed")
    } finally {
      setIsReranking(false)
    }
  }

  console.log(allApplicants)
  return (
    <div>
      <div className='flex justify-end mb-3'>
        <Button onClick={handleRerank} disabled={isReranking} variant="outline">
          {isReranking ? <Loader2 className='animate-spin h-4 w-4 mr-2'/> : <Sparkles className='h-4 w-4 mr-2'/>}
          {isReranking ? 'Reranking...' : 'Re-rank with AI'}
        </Button>
      </div>
      <Table >
         <TableCaption>A list of your job applicants </TableCaption>
         <TableHeader>
            <TableRow>
                  <TableHead  className='font-bold '>Name</TableHead>
                <TableHead className='font-bold '>Email</TableHead>
                <TableHead className='font-bold '>Contact</TableHead>
                <TableHead className='font-bold '>Resume</TableHead>
                <TableHead className='font-bold '>Match Score</TableHead>
                <TableHead className='font-bold '>AI Rerank</TableHead>
                <TableHead className='font-bold '>Status</TableHead>
                <TableHead className='font-bold '>Date</TableHead>
                <TableHead className='font-bold '>Action</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
         {
  Array.isArray(allApplicants?.applications) && allApplicants.applications.length > 0 ? (
    allApplicants.applications.map((job, idx) => (
      <TableRow key={job?._id}>
        <TableCell>{job?.applicant?.name}</TableCell>
        <TableCell>{job?.applicant?.email}</TableCell>
        <TableCell>{job?.applicant?.phoneNumber}</TableCell>
        <TableCell>
          <a href={job?.applicant?.profile?.resume} target="_blank" rel="noreferrer">
            {job?.applicant?.profile?.resumeOriginalName || "N/A"}
          </a>
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className={matchScoreBadgeClass(job?.matchScore ?? 0)}>
            {job?.matchScore ?? 0}%
          </Badge>
        </TableCell>
        <TableCell>
          {job?.aiRerank?.score != null ? (
            <Popover>
              <PopoverTrigger>
                <Badge variant="secondary" className={`cursor-pointer ${matchScoreBadgeClass(job.aiRerank.score)}`}>
                  {job.aiRerank.score}%
                </Badge>
              </PopoverTrigger>
              <PopoverContent className='w-72 text-sm space-y-2'>
                <p className='text-gray-700'>{job.aiRerank.reasoning}</p>
                {job.aiRerank.matchedRequirements?.length > 0 && (
                  <div>
                    <p className='font-semibold text-emerald-700'>Matched</p>
                    <p className='text-gray-600'>{job.aiRerank.matchedRequirements.join(', ')}</p>
                  </div>
                )}
                {job.aiRerank.missingRequirements?.length > 0 && (
                  <div>
                    <p className='font-semibold text-red-700'>Missing</p>
                    <p className='text-gray-600'>{job.aiRerank.missingRequirements.join(', ')}</p>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          ) : (
            <span className='text-gray-400'>—</span>
          )}
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className={statusBadgeClass(job?.status)}>
            {job?.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Pending'}
          </Badge>
        </TableCell>
        <TableCell>{job?.applicant?.createdAt?.split('T')[0] || "N/A"}</TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger>
              <MoreHorizontalIcon />
            </PopoverTrigger>
            <PopoverContent className='w-fit border-1 bg-amber-50 rounded'>
              {shortListingStatus.map((item, idx) => (
                <p key={idx} onClick={() => setConfirmTarget({ id: job._id, status: item, name: job?.applicant?.name })} className='my-1 p-2 cursor-pointer'>
                  {item}
                </p>
              ))}
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={9} className='text-center'>No applicants found</TableCell>
    </TableRow>
  )
}

         </TableBody>
      </Table>
      <Dialog open={!!confirmTarget} onOpenChange={(open) => !open && setConfirmTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Mark {confirmTarget?.name} as {confirmTarget?.status}?
            </DialogTitle>
          </DialogHeader>
          <p className='text-sm text-gray-500'>This will update their application status.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmTarget(null)}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer autoClose={1000} theme="dark"/>
    </div>
  )
}

export default ApplicantsTable
