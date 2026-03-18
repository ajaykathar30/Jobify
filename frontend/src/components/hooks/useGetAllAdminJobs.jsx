import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
const useGetAllAdminJobs = () => {
    const dispatch=useDispatch()
 useEffect(() => {
  const fetchData=async ()=>{
    try {
        const res=await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true})
        if(res.data.success){
            // console.log("hi")
            dispatch(setAllAdminJobs(res.data.jobs))
            // console.log(res.data.jobs)
        }
       
    } catch (error) {
        console.log(error)
    }
  }
  fetchData()
 }, [])
 
}

export default useGetAllAdminJobs
