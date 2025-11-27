import React from 'react'
import Navbar from '../shared/Navbar'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Button } from '../ui/button'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useDispatch } from 'react-redux'
import { setSinglecompany } from '@/redux/companySlice'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import { GlowingEffect } from '../ui/glowing-effect'
import { WavyBackground } from '../ui/wavy-background'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const CompanySetup = () => {
    const dispatch=useDispatch()

    const navigate=useNavigate()
    const { singleCompany } = useSelector(store => store.company)
    const {loading}=useSelector(store=>store.auth)
    
    const [company, setcompany] = useState({
         name: singleCompany?.name||'',
          description: singleCompany.description||'',
           website: singleCompany.website||'',
            location:singleCompany.location|| '',
            file:null })
    const handleChange = (e) => {
        setcompany({ ...company, [e.target.name]: e.target.value })
        console.log(e.target.value)
    }
    const handleFile = (e) => {
        const file = e.target.files?.[0]
        setcompany((prev) => ({ ...prev, file }))
    }
    const handleSubmit = async (e) => {
        console.log(company)
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", company.name)
        formData.append("description", company.description)
        formData.append("website", company.website)
        formData.append("location", company.location)
        if (company.file)
            formData.append("file", company.file)
        try {
            dispatch(setLoading(true))
            const res=await axios.put(`${COMPANY_API_END_POINT}/update/${singleCompany._id}`,formData,{
            headers:{
                 'Content-Type':'multipart/form-data',
            },
            withCredentials:true
        })

         if(res.data.success){
                dispatch(setSinglecompany(res.data.company))
                setTimeout(() => {
                    navigate("/admin/companies")
                }, 1500);
                toast.success(res.data.message)}
            } catch (error) {
             console.log(error)
            toast.error(error.response.data.message)
        }
        finally{
            
            dispatch(setLoading(false))
        }

    }
    return (
        <>
            <Navbar />
            <WavyBackground className="max-w-4xl mx-auto pb-40">

            <div className=' relative w-4xl mx-auto my-10  p-2  bg-gray-200 shadow-2xl rounded-2xl'>
                    {/* <GlowingEffect/> */}
                <h1 className='text-5xl font-bold my-3'>
                    Company setup
                </h1>
                <div className='flex flex-col mx-2'>

                    <input type="text" className='my-2 p-2 border-2 border-amber-50 rounded '  value={company.name} onChange={handleChange} placeholder='company name' name='name' />
                    <input type="text" className='my-2 p-2 border-2  border-amber-50 rounded' value={company.description} onChange={handleChange} placeholder='description of company ' name='description' />
                    <input type="text" className='my-2 p-2 border-2  border-amber-50 rounded' value={company.website} onChange={handleChange} placeholder='Company website..' name='website' />
                    <input type="text" className='my-2 p-2 border-2  border-amber-50 rounded' value={company.location} onChange={handleChange} placeholder='Company location..' name='location' />
                     <div className=' flex gap-4 items-center my-2'>

                    <p>Company logo</p>
                    <input type="file" onChange={handleFile} name='file' />
                     </div>
                    <div className=' flex gap-4 items-center my-2'>
                    <Button onClick={()=>navigate("/admin/companies")}>
                        <ArrowLeft/>
                        Back</Button>
                    {
                        (loading)?<Button className='' onClick={handleSubmit}><Loader2 className='animate-spin'/> Please wait </Button>:
                        <Button type="submit" className='cursor-pointer' onClick={handleSubmit}>Commit changes </Button>
                    }
                    {/* <Button type="submit" className='cursor-pointer' onClick={handleSubmit}>Commit changes </Button> */}
                    </div>
                </div>


            </div>
            </WavyBackground>

        </>
    )
}

export default CompanySetup
