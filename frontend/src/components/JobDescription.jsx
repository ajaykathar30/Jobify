import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Navbar from './shared/Navbar';
import { setSinglejob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

const JobDescription = () => {
    // --- YOUR EXACT LOGIC STARTS HERE ---
    const params = useParams();
    const id = params.id;
    // console.log(id)
    const { singleJob } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some((application) => application.applicant === user?._id) || false;
    const [isApplied, setisApplied] = useState(isInitiallyApplied);

    const handleApply = async () => {
        try {
            // console.log('hi')
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${id}`, { withCredentials: true })
            // console.log(res.data)
            if (res.data.success) {
                setisApplied(true)
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user.id }] }
                dispatch(setSinglejob(updatedSingleJob))
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true })
                if (res.data.success) {
                    console.log(user?._id)
                    dispatch(setSinglejob(res.data.job))
                    setisApplied(res.data.job.applications.some((application) => application.applicant === (user?._id)))
                }
                const Job = res.data.job
                // setjobs(Job)
                console.log(Job)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [id, dispatch, user?._id])
    // --- YOUR LOGIC ENDS HERE ---

    // --- NEW MODERN DESIGN STARTS HERE ---
    if (!singleJob) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center h-screen bg-gray-50">
                    <div className="animate-pulse text-emerald-600 font-semibold text-lg">Loading Job Details...</div>
                </div>
            </>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <Navbar />
            {/* Main Content Container */}
            <div className='max-w-4xl mx-auto mt-10'>

                {/* Job Header Card */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                    <div>
                        <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight'>{singleJob.title}</h1>

                        {/* Badges Section */}
                        <div className='flex flex-wrap items-center gap-3 my-5'>
                            <Badge variant="secondary" className='bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200 px-3 py-1 text-sm'>
                                {singleJob.vacancy} positions
                            </Badge>
                            <Badge variant="secondary" className='bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 px-3 py-1 text-sm'>
                                ₹ {singleJob.salary} LPA
                            </Badge>
                            <Badge variant="secondary" className='bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border-cyan-200 px-3 py-1 text-sm'>
                                {singleJob.jobType}
                            </Badge>
                        </div>
                    </div>

                    {/* Apply Button Section */}
                    <div className="flex-shrink-0">
                        {isApplied ? (
                            <Button disabled className='bg-gray-300 text-gray-600 cursor-not-allowed px-8 py-3 text-lg rounded-full font-semibold'>
                                Already Applied
                            </Button>
                        ) : (
                            <Button onClick={handleApply} className='bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg'>
                                Apply Now
                            </Button>
                        )}
                    </div>
                </div>

                {/* Job Details Card */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6'>
                    <h2 className='text-xl font-bold text-gray-900 mb-6'>Job Overview</h2>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4 mb-8 pb-8 border-b border-gray-100">
                        <DetailItem label="Location" value={singleJob.location} />
                        <DetailItem label="Salary" value={`${singleJob.salary} LPA`} />
                        <DetailItem label="Job Type" value={singleJob.jobType} />
                        <DetailItem label="Posted Date" value={singleJob?.createdAt?.split('T')[0] || 'N/A'} />
                        <DetailItem label="Positions" value={singleJob.vacancy} />
                        <DetailItem label="Total Applicants" value={singleJob?.applications?.length || 0} />
                    </div>

                    {/* Full Description */}
                    <div>
                        <h2 className='text-xl font-bold text-gray-900 mb-4'>Job Description</h2>
                        <div className='text-gray-700 leading-relaxed whitespace-pre-line font-poppins'>
                            {singleJob.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for grid items to reduce repetition
const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className='text-sm text-muted-foreground font-medium mb-1'>{label}</span>
        <span className='text-base font-semibold text-gray-900'>{value}</span>
    </div>
);

export default JobDescription;