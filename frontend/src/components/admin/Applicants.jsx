import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import { useEffect } from 'react'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import {useParams} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'

const Applicants = () => {
    const dispatch=useDispatch()
    const params=useParams()

    useEffect(() => {
        const fetchData=async ()=>{
            try {
                const res=await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`,{withCredentials:true})
                    if(res.data.success){
                        dispatch(setAllApplicants(res.data.job))
                        console.log(res.data.job)

                    }
                    else{
                    }
            } catch (error) {
                console.log(error)
            }
        }
    fetchData()
    }, [])
    

  return (
   <>
   <Navbar/>
   <div className='max-w-6xl mx-auto my-10  p-2'>
    <h1 className='text-4xl font-bold mb-3'>Applicants List</h1>
    <ApplicantsTable/>
   </div>
   </>
  )
}

export default Applicants
