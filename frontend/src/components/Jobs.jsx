import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import FilterCard from './FilterCard';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector(store => store.job);
  const [filteredJobs, setFilteredJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const relevantJobs = allJobs.filter(job =>
        job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchedQuery.toLowerCase())
      );
      setFilteredJobs(relevantJobs);
    } else {
      setFilteredJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />

      <div className="max-w-[1400px] mx-auto mt-5 px-4">
        
        {/* MAIN CONTAINER */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* LEFT FILTER PANEL (hidden on mobile unless needed) */}
          <div className="w-full md:w-[240px] md:shrink-0">
            <FilterCard />
          </div>

          {/* RIGHT JOB LIST SECTION */}
          <div className="flex-1 min-w-0">
            {
              filteredJobs.length <= 0 ? (
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
                    {filteredJobs.map(job => (
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
