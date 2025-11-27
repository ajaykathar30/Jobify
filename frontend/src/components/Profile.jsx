import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'

// keeping your existing constants
const resume = true;

const Profile = () => {
    const [open, setopen] = useState(false);
    const { user } = useSelector(store => store.auth);

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

                        {/* Resume & Skills */}
                        <div className='space-y-4'>
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
                            
                            <div>
                                <h2 className='text-lg font-semibold text-gray-900 mb-1'>Resume</h2>
                                {resume ? (
                                    <a 
                                        href={user?.profile?.resume} 
                                        target='_blank' 
                                        rel='noopener noreferrer' 
                                        className='text-emerald-600 hover:underline text-sm font-medium flex items-center gap-1'
                                    >
                                        {user?.profile?.resumeOriginalName || "Download Resume"}
                                    </a>
                                ) : (
                                    <span className='text-sm text-gray-500'>NA</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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