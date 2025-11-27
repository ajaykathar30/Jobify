import React from 'react'
import { GlowingEffect } from './ui/glowing-effect'

import { useEffect } from 'react'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useState } from 'react'

const AppliedJobTable = () => {
     const [applications, setapplications] = useState([])

   useEffect(() => {
     const fetchData=async ()=>{

          try {
               const res=await axios.get(`${APPLICATION_API_END_POINT}/get`,{withCredentials:true})
               setapplications(res.data.applications)
               console.log(res.data.applications)
               
          } catch (error) {
               console.log(error)
          }
     }
     fetchData()
   
    
   }, [])
   
  return (
    <>
    <div className="relative w-full my-6 rounded-xl p-2 bg-">
    
       
       <h1 className='font-bold text-xl my-2'>Applied Jobs</h1>
          <table className='w-4/5 border-1 rounded-2xl'>
          <thead>
               <tr>

            <th>Date</th>
            <th>Position</th>
            <th>Company Name</th>
            <th>Status</th>
               </tr>
          </thead>
          <tbody>
               {
                    applications.map((item,idx)=>(
                        
            <tr className='text-center '  key={item._id}>
                 <td className='p-2 font-poppins font-bold'>{item?.createdAt?.split('T')[0]}</td>
                 <td className='p-2 font-poppins font-bold'>{item?.job?.title}</td>
                 <td className='p-2 font-poppins font-bold '>{item?.job?.company?.name}</td>
                 <td className={`p-2 font-poppins font-bold  rounded 
                     ${item?.status==='accepted'?"   bg-green-300 text-emerald-900":item.status==='rejected'?"bg-red-300 text-red-800":""}`}>{item?.status}</td>
            </tr>
                    ))
               }


            {/* <tr className='text-center'>
                 <td className='p-2 font-poppins font-bold'>1/2/25</td>
                 <td className='p-2 font-poppins font-bold'>Backend Dev</td>
                 <td className='p-2 font-poppins font-bold'>Google</td>
                 <td className='p-2 font-poppins font-bold text-muted-foreground'>pending</td>
            </tr>
            <tr className='text-center'>
                 <td className='p-2 font-poppins font-bold'>1/2/25</td>
                 <td className='p-2 font-poppins font-bold'>FullStack Dev</td>
                 <td className='p-2 font-poppins font-bold'>Amazon</td>
                 <td className='p-2 font-poppins font-bold text-muted-foreground'>pending</td>
            </tr>
            <tr className='text-center'>
                 <td className='p-2 font-poppins font-bold'>1/2/25</td>
                 <td className='p-2 font-poppins font-bold'>Product Manager</td>
                 <td className='p-2 font-poppins font-bold'>Microsoft</td>
                 <td className='p-2 font-poppins font-bold text-muted-foreground'>pending</td>
            </tr> */}
          </tbody>
          </table>
    </div>
    </>
  )
}

export default AppliedJobTable
