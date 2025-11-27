import React from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { GlowingEffect } from '../ui/glowing-effect'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import { APPLICATION_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setSinglecompany } from '@/redux/companySlice';
const CompanyCreate = () => {
  const dispatch=useDispatch()
  const [companyName, setCompanyName] = useState('')
    const navigate =useNavigate()
    const handleChange=(e)=>{
      console.log(e.target.value)
      setCompanyName(e.target.value)

    }
    const handleContinue=async ()=>{
      try {
        const res=await axios.post(`${COMPANY_API_END_POINT}/register`,{companyName},{withCredentials:true})
          if(res.data.success){
            const companyId=res.data.company._id
            dispatch(setSinglecompany(res.data.company))
            setTimeout(() => {
              navigate(`/admin/companies/${companyId}`)
            }, 1500);
            toast.success(res.data.message)
          }
          else {
             toast.error(res.data.message)
          }
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }
    }
  return (

    <div >
        <Navbar/>
        <div className='relative w-2xl mx-auto my-5 bg-gray-100 p-5 rounded shadow-2xl'>
            <GlowingEffect
                      spread={40}
                      glow={true}
                      disabled={false}
                      proximity={65}
                      inactiveZone={0.01}
                    />
                    {/* <TypewriterEffectSmooth words={words} /> */}
           <h1 className='text-5xl mb-10 font-bold '>Enter your company name </h1>

           <input type="text" placeholder='eg. Microsoft ' value={companyName} onChange={handleChange} className='p-1.5 outline-0 w-full rounded bg-white' />
        <div className='flex justify-start gap-8 my-7'>
                <Button variant='outline' onClick={()=>navigate("/admin/companies")}>Cancel</Button>
                <Button  className='cursor-pointer' onClick={handleContinue}>Continue</Button>
        </div>
        </div>


    </div>
  )
}

export default CompanyCreate
