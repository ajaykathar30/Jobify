import React from 'react';
import JobCards from './JobCards';
import { useSelector } from 'react-redux';
const rjob=[1,2,3,4,5,6,7,8,9]
import {useNavigate} from 'react-router-dom'
import { Button } from './ui/button';
import { ArrowRightIcon } from 'lucide-react';

const LatestJob = () => {
  const {allJobs}=useSelector(store=>store.job)
  const navigate=useNavigate()
  return (
    <>
   <div className='mt-10 pb-10 ' >

    {/* Changed fixed w-6xl to max-w-7xl mx-auto px-5 */}
    <div className='max-w-7xl mx-auto mb-10 px-5'>
      
      <h1 className='text-left text-2xl sm:text-2xl lg:text-3xl uppercase font-black italic leading-normal'>
        Latest Job Openings
      </h1>
    </div>
    
    {/* Changed grid-cols-3 to grid-cols-1 (mobile) -> md:grid-cols-2 (tablet) -> lg:grid-cols-3 (desktop) */}
    {/* Changed w-4/5 to max-w-7xl mx-auto px-5 */}
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-5 gap-4 md:gap-10'>

  {
      allJobs.length!=0?allJobs.slice(0,6). map((job)=>(
            <JobCards key={job._id} job={job}/> 
        )):<h1>No job openings available  </h1>
    }
    </div>
    <div className="flex justify-center mt-10">
  <Button  onClick={()=>navigate("./jobs")} className=" animate-bounce p-3 cursor-pointer">More Jobs<ArrowRightIcon/></Button>
</div>
    </div>


    </>
  );
};

export default LatestJob;