import React from 'react';
import JobCards from './JobCards';
import { useSelector } from 'react-redux';
const rjob=[1,2,3,4,5,6,7,8,9]
import {useNavigate} from 'react-router-dom'
const LatestJob = () => {
  const {allJobs}=useSelector(store=>store.job)
  const navigate=useNavigate()
  return (
    <>
   <div className='mt-10 pb-10 ' >

    <div className='m-auto  mb-10 w-6xl '>
      
      <h1 className='text-left sm:text-2xl lg:text-3xl uppercase font-black italic leading-normal'>
        Latest Job Openings
      </h1>
    </div>
    <div className='grid grid-cols-3 m-auto w-4/5 gap-10'>

  {
      allJobs.length!=0?allJobs.slice(0,6). map((job)=>(
            <JobCards key={job._id} job={job}/> 
        )):<h1>No job openings available  </h1>
    }
    </div>
    </div>



    </>
  );
};

export default LatestJob;
