import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAlljobs, setSearchedQuery } from '@/redux/jobSlice'

const Browse = () => {
  const dispatch = useDispatch()
  const { searchedQuery, allJobs } = useSelector(store => store.job)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,
          { withCredentials: true }
        )
        dispatch(setAlljobs(res.data.jobs))
        dispatch(setSearchedQuery(""))
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto my-6 px-3 sm:px-6 lg:px-0">
        <h1 className="p-2 text-muted-foreground mb-4 text-lg">
          Search results ({allJobs.length})
        </h1>

        {/* Responsive grid */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-4
        ">
          {allJobs.map((job, idx) => (
            <Job job={job} key={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Browse
