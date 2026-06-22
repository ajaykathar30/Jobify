import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import FilterCard from './FilterCard';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from "framer-motion";
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';

const Jobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector(store => store.job);

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState(null);
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async (currentKeyword, currentLocation, currentSalary) => {
    try {
      const params = new URLSearchParams();
      if (currentKeyword) params.set('keyword', currentKeyword);
      if (currentLocation) params.set('location', currentLocation);
      if (currentSalary?.min != null) params.set('minSalary', currentSalary.min);
      if (currentSalary?.max != null) params.set('maxSalary', currentSalary.max);

      const res = await axios.get(`${JOB_API_END_POINT}/get?${params.toString()}`, { withCredentials: true });
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle handoff from Hero search bar / CategoryCarousel
  useEffect(() => {
    const initialKeyword = searchedQuery || '';
    setKeyword(initialKeyword);
    if (searchedQuery) dispatch(setSearchedQuery(''));
    fetchJobs(initialKeyword, location, salary);
  }, []);

  useEffect(() => {
    fetchJobs(keyword, location, salary);
  }, [location, salary]);

  return (
    <div>
      <Navbar />

      <div className="max-w-[1400px] mx-auto mt-5 px-4">

        {/* Search bar */}
        <div className="flex gap-3 mb-5 max-w-2xl">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchJobs(keyword, location, salary); }}
            placeholder="Search the job you want . . ."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-md outline-none"
          />
          <Button onClick={() => fetchJobs(keyword, location, salary)}>
            <Search className="h-4 w-4 mr-1" /> Search
          </Button>
        </div>

        {/* MAIN CONTAINER */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* LEFT FILTER PANEL */}
          <div className="w-full md:w-[240px] md:shrink-0">
            <FilterCard
              location={location}
              salary={salary}
              onLocationChange={setLocation}
              onSalaryChange={setSalary}
            />
          </div>

          {/* RIGHT JOB LIST SECTION */}
          <div className="flex-1 min-w-0">
            {
              jobs.length <= 0 ? (
                <span className="text-gray-500 ">Job not found</span>
              ) : (
                <div className="h-[85vh] overflow-y-auto pb-3">

                  {/* Responsive Grid */}
                  <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-5
                  ">
                    {jobs.map(job => (
                      <motion.div
                        key={job._id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Job job={job} />
                      </motion.div>
                    ))}
                  </div>

                </div>
              )
            }
          </div>

        </div>
      </div>
    </div>
  );
};

export default Jobs;
