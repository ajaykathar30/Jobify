import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { Badge } from './ui/badge' // Assuming you have this from the previous file

const AppliedJobTable = () => {
    const [applications, setapplications] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true })
                setapplications(res.data.applications)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="mt-4">
            {applications.length <= 0 ? (
                <div className="text-gray-500 text-center py-10">
                    You haven't applied to any jobs yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className='w-full text-sm text-left text-gray-500'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                            <tr>
                                <th scope="col" className='px-6 py-3'>Date</th>
                                <th scope="col" className='px-6 py-3'>Job Role</th>
                                <th scope="col" className='px-6 py-3'>Company</th>
                                <th scope="col" className='px-6 py-3 text-right'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((item) => (
                                <tr key={item._id} className='bg-white border-b hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 font-medium text-gray-900'>
                                        {item?.createdAt?.split('T')[0]}
                                    </td>
                                    <td className='px-6 py-4 text-gray-900'>
                                        {item?.job?.title}
                                    </td>
                                    <td className='px-6 py-4 text-gray-900'>
                                        {item?.job?.company?.name}
                                    </td>
                                    <td className='px-6 py-4 text-right'>
                                        <Badge 
                                            className={`${
                                                item?.status === "rejected" 
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' 
                                                : item?.status === 'accepted' 
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                                            }`} 
                                            variant="outline"
                                        >
                                            {item.status.toUpperCase()}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AppliedJobTable