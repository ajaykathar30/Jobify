import React, { useState } from 'react'
import { WavyBackground } from '../ui/wavy-background'
import Navbar from '../shared/Navbar'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setSinglecompany } from '@/redux/companySlice'
const CompanyArray=[]
const PostJob = () => {

      const dispatch=useDispatch()
       const {loading}=useSelector(store=>store.auth)
       const {allCompanies}=useSelector(store=>store.company)
    const navigate=useNavigate()
    const [job, setjob] = useState({
        title:'',location:'',jobType:'',experience:'',salary:'',vacancy:'',requirements:'',description:'',companyId:''
    })
    const handleChange=(e)=>{
            setjob({...job,[e.target.name]:e.target.value})
            console.log(e.target.value)
    }
    
const handleSubmit = async (e) => {
        console.log(job)
        e.preventDefault()
        try {
            dispatch(setLoading(true))
            const res=await axios.post(`${JOB_API_END_POINT}/post`,job,{withCredentials:true})
            console.log("hi")
         if(res.data.success){
                dispatch(setSinglecompany(res.data.company))
                setTimeout(() => {
                    navigate("/admin/jobs")
                }, 1500);
                toast.success(res.data.message)}
                setjob({
        title:'',location:'',jobType:'',experience:'',salary:'',vacancy:'',requirements:'',description:'',companyId:''
    })
            } catch (error) {
                  console.log("hi2")
             console.log(error)
            toast.error(error.response.data.message)
        }
        finally{
            
            dispatch(setLoading(false))
        }
    }


  return (
    <>
    <Navbar/>

     <WavyBackground className="max-w-4xl mx-auto pb-40">
      <div className=' relative w-4xl mx-auto my-10  p-2  bg-gray-100 shadow-2xl rounded-2xl'>
                    {/* <GlowingEffect/> */}
                <h1 className='text-5xl font-bold my-3'>
                    Post new job
                </h1>
                <div className='flex flex-col mx-2'>
                    <div className='grid grid-cols-2 gap-3'>
                    <input type="text" className='my-2 p-2 border-1 border-amber-50 rounded   '  value={job.title} onChange={handleChange} placeholder='Job title' name='title' />
                    <input type="text" className='my-2 p-2 border-1 border-amber-50 rounded ' value={job.description} onChange={handleChange} placeholder='Job description' name='description' />

                    <input type="number" className='my-2 p-2 border-1  border-amber-50 rounded ' value={job.experience} onChange={handleChange} placeholder='Experience required (in years)' name='experience' />
                    <input type="number" className='my-2 p-2 border-1  border-amber-50 rounded ' value={job.salary} onChange={handleChange} placeholder='Salary (in LPA )' name='salary' />
                    <input type="text" className='my-2 p-2 border-1  border-amber-50 rounded ' value={job.location} onChange={handleChange} placeholder='job location..' name='location' />
                    <input type="text" className='my-2 p-2 border-1  border-amber-50 rounded ' value={job.requirements} onChange={handleChange} placeholder='Skills required eg. reactJS , NodeJs , NextJs...' name='requirements' />
                    <input type="number" className='my-2 p-2 border-1  border-amber-50 rounded ' value={job.vacancy} onChange={handleChange} placeholder='No. of vacancies ' name='vacancy' />
                    <select name="jobType" onChange={handleChange} className='my-2 p-2 border-1  border-amber-50 rounded'>
                    <option disabled>Job Type</option>
                    <option value="Full-time">Full-Time</option>
                    <option value="W.F.H.">W.F.H.</option>
                    <option value="Part-Time">Part-Time</option>
                    </select>
                    <select name="companyId" onChange={handleChange} className='my-2 p-2 border-1  border-amber-50 rounded'>
                    <option disabled>Choose Company</option>
                   {
                    allCompanies.length>0 && allCompanies?.map((company,idx)=>(
                        <option value={company._id} key={idx}>{company.name}</option>
                    ))
                   }
                    </select>
                    </div>


                    
                    <div className=' flex gap-4 items-center my-4'>
                    <Button onClick={()=>navigate("/admin/jobs")}>
                        <ArrowLeft/>
                        Back</Button>
                    {
                        (loading)?<Button className='' onClick={handleSubmit}><Loader2 className='animate-spin'/> Please wait </Button>:
                        <Button type="submit" className='cursor-pointer' onClick={handleSubmit}>Post new job </Button>
                    }

                    </div>
                    {
                        allCompanies.length<=0 && <p className='text-red-600'>Please register a company first before posting a job !! </p>
                    }
                </div>


            </div>
     </WavyBackground>


    </>
  )
}

export default PostJob
