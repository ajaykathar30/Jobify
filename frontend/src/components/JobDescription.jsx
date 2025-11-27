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
    const { singleJob } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    
    const isInitiallyApplied = singleJob?.applications?.some((application) => application.applicant === user?._id) || false;
    const [isApplied, setisApplied] = useState(isInitiallyApplied);

    const handleApply = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${id}`, { withCredentials: true })
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
                    dispatch(setSinglejob(res.data.job))
                    setisApplied(res.data.job.applications.some((application) => application.applicant === (user?._id)))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [id, dispatch, user?._id])
    // --- YOUR LOGIC ENDS HERE ---


    // --- MODERN EMERALD DESIGN ---
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
            
            <div className='max-w-4xl mx-auto mt-10 px-4 sm:px-0'>
                
                {/* 1. HEADER CARD: Title, Company Info, and Apply Button */}
                <div className='bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                    
                    {/* Left Side: Logo + Text */}
                    <div className="flex gap-4 items-start">
                        {/* Company Logo */}
                        <div className="h-16 w-16 rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 bg-white">
                            <img 
                                src={singleJob?.company?.logo} 
                                alt={singleJob?.company?.name} 
                                className="h-full w-full object-contain p-1"
                            />
                        </div>

                        {/* Text Details */}
                        <div>
                            <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight leading-tight'>
                                {singleJob.title}
                            </h1>
                            <div className='flex items-center gap-2 mt-1'>
                                <span className='text-emerald-600 font-semibold text-lg'>
                                    {singleJob?.company?.name}
                                </span>
                                <span className="text-gray-400 hidden sm:inline">•</span>
                                <span className='text-gray-500 text-sm hidden sm:inline'>
                                    {singleJob.location}
                                </span>
                            </div>

                            {/* Badges */}
                            <div className='flex flex-wrap items-center gap-3 mt-4'>
                                <Badge variant="secondary" className='bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 px-3 py-1 text-sm rounded-full'>
                                    {singleJob.vacancy} positions
                                </Badge>
                                <Badge variant="secondary" className='bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 px-3 py-1 text-sm rounded-full'>
                                    ₹ {singleJob.salary} LPA
                                </Badge>
                                <Badge variant="secondary" className='bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 px-3 py-1 text-sm rounded-full'>
                                    {singleJob.jobType}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Apply Button */}
                    <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                        {isApplied ? (
                            <Button disabled className='w-full md:w-auto bg-gray-300 text-gray-600 cursor-not-allowed px-8 py-3 text-lg rounded-full font-semibold'>
                                Already Applied
                            </Button>
                        ) : (
                            <Button onClick={handleApply} className='w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-200'>
                                Apply Now
                            </Button>
                        )}
                    </div>
                </div>

                {/* 2. JOB DETAILS CARD */}
                <div className='bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 mt-6'>
                    <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                        Job Overview
                    </h2>
                    
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4 mb-8 pb-8 border-b border-gray-100">
                        <DetailItem label="Role" value={singleJob.title} />
                        <DetailItem label="Location" value={singleJob.location} />
                        <DetailItem label="Experience" value={`${singleJob.experienceLevel} Years`} />
                        <DetailItem label="Salary" value={`${singleJob.salary} LPA`} />
                        <DetailItem label="Applicants" value={singleJob?.applications?.length || 0} />
                        <DetailItem label="Posted Date" value={singleJob?.createdAt?.split('T')[0] || 'N/A'} />
                    </div>

                    {/* Requirements Section (Added since you have the data) */}
                    {singleJob.requirements && (
                        <div className="mb-8">
                            <h2 className='text-xl font-bold text-gray-900 mb-4'>Requirements</h2>
                            <div className="flex flex-wrap gap-2">
                                {singleJob.requirements.split(',').map((req, idx) => (
                                    <span key={idx} className="bg-emerald-50 text-emerald-700 font-medium px-3 py-1 rounded-lg text-sm border border-emerald-100">
                                        {req.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description Section */}
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

// Helper component
const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className='text-sm text-muted-foreground font-medium mb-1'>{label}</span>
        <span className='text-base font-semibold text-gray-900'>{value}</span>
    </div>
);

export default JobDescription;