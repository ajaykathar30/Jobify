import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, StarsIcon, Loader2 } from 'lucide-react'
import { Badge } from './ui/badge'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { AI_API_END_POINT, USER_API_END_POINT } from '@/utils/constant'
// keeping your existing constants

const resume = true;

const Profile = () => {
    const [open, setopen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [analysis, setAnalysis] = useState({})
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [recommendedJobs, setRecommendedJobs] = useState([])
    const [savedJobs, setSavedJobs] = useState([])

    useEffect(() => {
        if (!user?.profile?.resume) return;
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get(`${AI_API_END_POINT}/jobRecommendations`, { withCredentials: true })
                if (res.data.success) {
                    setRecommendedJobs(res.data.jobs)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchRecommendations()
    }, [user?.profile?.resume])

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/savedJobs`, { withCredentials: true })
                if (res.data.success) {
                    setSavedJobs(res.data.jobs)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSavedJobs()
    }, [user?.profile?.savedJobs])
    const handleClick=async ()=>{
        if (isAnalyzing) return;
        try {
            setIsAnalyzing(true)
            const res=await axios.get(`${AI_API_END_POINT}/analyzeResume`,{
                withCredentials:true
            })
            const data=res.data;
            console.log(data)
            setAnalysis(data.analysis);
        } catch (error) {
            console.log(error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <Navbar />

            <div className='max-w-4xl mx-auto mt-10 px-4 md:px-0'>

                {/* Profile Information Card */}
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8'>

                    {/* Header Section: Avatar, Name, Edit Button */}
                    <div className='flex justify-between items-start'>
                        <div className='flex items-center gap-6'>
                            <Avatar className="h-24 w-24 cursor-pointer border-4 border-gray-50 shadow-sm">
                                <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
                            </Avatar>
                            <div>
                                <h1 className='font-bold text-2xl text-gray-900'>{user?.name?.toUpperCase()}</h1>
                                <p className='text-gray-500 font-medium text-sm mt-1 max-w-md'>
                                    {user?.profile?.bio || "No bio added yet."}
                                </p>
                            </div>
                        </div>
                        <Button onClick={() => setopen(true)} variant="outline" size="icon" className="h-10 w-10 text-gray-500 hover:text-gray-900">
                            <Pen className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Contact & Professional Details Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>



                        {/* Resume & Skills */}

                        <div>
                            <h2 className='text-lg font-semibold text-gray-900 mb-2'>Skills</h2>
                            <div className='flex flex-wrap gap-2'>
                                {user?.profile?.skills.length !== 0 ? (
                                    user?.profile?.skills.map((item, idx) => (
                                        <Badge key={idx} variant="secondary" className='bg-gray-100 text-gray-700 hover:bg-gray-200'>
                                            {item}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className='text-sm text-gray-500'>NA</span>
                                )}
                            </div>
                        </div>


                        {/* Contact Info */}
                        <div className='space-y-4'>
                            <h2 className='text-lg font-semibold text-gray-900'>Contact Information</h2>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <Mail className='h-5 w-5' />
                                <span className='text-sm font-medium'>{user?.email}</span>
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <Contact className='h-5 w-5' />
                                <span className='text-sm font-medium'>{user?.phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                    <div className='p-1 m-2'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-1'>Resume</h2>
                        {user.profile.resume? (

                            <div>

                            <div className='flex items-center gap-3 flex-wrap'>
                                <div>

                                    <a
                                        href={user?.profile?.resume}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-emerald-600 hover:underline text-md font-medium flex items-center gap-1'
                                        >
                                        {user?.profile?.resumeOriginalName || "Your Resume"}
                                    </a>
                                </div>
                                <div>

                                    <button
    className="cursor-pointer group p-[2px] rounded-full
    bg-gradient-to-r from-emerald-500 via-sky-500 to-yellow-400
    transition-all duration-300 ease-out
    hover:scale-[1.01] hover:shadow-md
    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
    onClick={handleClick}
    disabled={isAnalyzing}>
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white text-black font-normal text-sm transition-all duration-300 group-hover:bg-white/95">
        {isAnalyzing ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <StarsIcon size={20} className="transition-transform duration-300 ease-out group-hover:rotate-90" />
        )}
                            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}</span></button>


                                </div>
                            </div>
                            <div>
                               {isAnalyzing && (
                                   <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4 animate-pulse">
                                       <div className="h-5 w-40 bg-gray-200 rounded" />
                                       <div className="h-4 w-full bg-gray-200 rounded" />
                                       <div className="h-4 w-5/6 bg-gray-200 rounded" />
                                       <div className="h-4 w-2/3 bg-gray-200 rounded" />
                                       <p className="text-sm text-gray-500">Analyzing your resume, this may take a few seconds...</p>
                                   </div>
                               )}
                               {!isAnalyzing && Object.keys(analysis).length > 0 && (
                                   <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-5">

    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
      <StarsIcon className="h-5 w-5 text-emerald-600" />
      Resume Analysis
    </h2>

    {/* Summary */}
    {analysis.summary && (
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Summary</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {analysis.summary}
        </p>
      </div>
    )}

    {/* Strengths */}
    {analysis.strengths?.length > 0 && (
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Strengths</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {analysis.strengths.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Weaknesses */}
    {analysis.weaknesses?.length > 0 && (
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Areas to Improve</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {analysis.weaknesses.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Suggested Skills */}
    {analysis.suggestedSkills?.length > 0 && (
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggested Skills</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.suggestedSkills.map((skill, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="bg-emerald-50 text-emerald-700"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    )}

    {/* Suggested Experience */}
    {analysis.suggestedExperience?.length > 0 && (
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Experience Suggestions
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {analysis.suggestedExperience.map((exp, idx) => (
            <li key={idx}>{exp}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Formatting Feedback */}
    {analysis.formattingFeedback && (
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          Formatting Feedback
        </h3>
        <p className="text-sm text-gray-600">
          {analysis.formattingFeedback}
        </p>
      </div>
    )}

    {/* Overall Score */}
    {typeof analysis.overallScore === "number" && (
      <div className="flex items-center gap-3 pt-2">
        <span className="text-sm font-semibold text-gray-700">
          Overall Score:
        </span>
        <span className="text-lg font-bold text-emerald-600">
          {analysis.overallScore}/10
        </span>
      </div>
    )}
  </div>
)}

                            </div>
                        

        </div>
                        ) : (
                            <span className='text-sm text-gray-500'>NA</span>
                        )}
                    </div>

                </div>

                {/* Saved Jobs Section */}
                {savedJobs.length > 0 && (
                    <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8'>
                        <h2 className='font-bold text-xl text-gray-900 mb-5'>Saved Jobs</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                            {savedJobs.map(job => (
                                <Job job={job} key={job._id} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Jobs For You Section */}
                {recommendedJobs.length > 0 && (
                    <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8'>
                        <h2 className='font-bold text-xl text-gray-900 mb-5'>Jobs For You</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                            {recommendedJobs.map(job => (
                                <Job job={job} key={job._id} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Applied Jobs Section */}
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-8'>
                    <h2 className='font-bold text-xl text-gray-900 mb-5'>Applied Jobs</h2>
                    <AppliedJobTable />
                </div>

                <UpdateProfileDialog open={open} setopen={setopen} />
            </div>
        </div>
    )
}

export default Profile