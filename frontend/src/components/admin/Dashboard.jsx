import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import { DASHBOARD_API_END_POINT } from '@/utils/constant'

const StatCard = ({ label, value }) => (
  <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex-1 min-w-[160px]'>
    <p className='text-sm text-gray-500 font-medium mb-1'>{label}</p>
    <p className='text-2xl font-bold text-gray-900'>{value}</p>
  </div>
)

const jobStatusBadgeClass = (status) => status === 'closed' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'

const Dashboard = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${DASHBOARD_API_END_POINT}`, { withCredentials: true })
        if (res.data.success) {
          setData(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchDashboard()
  }, [])

  return (
    <div className='bg-gray-50 min-h-screen pb-10'>
      <Navbar />
      <div className='max-w-6xl mx-auto mt-10 px-4 md:px-0'>
        <h1 className='font-bold text-2xl text-gray-900 mb-6'>Dashboard</h1>

        {data && (
          <>
            <div className='flex flex-wrap gap-4 mb-8'>
              <StatCard label='Total Jobs' value={data.totalJobs} />
              <StatCard label='Open / Closed' value={`${data.openJobs} / ${data.closedJobs}`} />
              <StatCard label='Total Applications' value={data.totalApplications} />
              <StatCard label='Avg Match Score' value={data.avgMatchScore != null ? `${data.avgMatchScore}%` : 'N/A'} />
              <StatCard label='Acceptance Rate' value={data.acceptanceRate != null ? `${data.acceptanceRate}%` : 'N/A'} />
            </div>

            <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8'>
              <h2 className='font-bold text-xl text-gray-900 mb-5'>Applications Received (Last 30 Days)</h2>
              <ResponsiveContainer width='100%' height={250}>
                <BarChart data={data.applicationsOverTime}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' tick={{ fontSize: 10 }} interval={4} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey='count' fill='#10b981' />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-8'>
              <h2 className='font-bold text-xl text-gray-900 mb-5'>Per-Job Breakdown</h2>
              <Table>
                <TableCaption>A breakdown of applicants across all your posted jobs</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='font-bold'>Job</TableHead>
                    <TableHead className='font-bold'>Status</TableHead>
                    <TableHead className='font-bold'>Applicants</TableHead>
                    <TableHead className='font-bold'>Pending</TableHead>
                    <TableHead className='font-bold'>Accepted</TableHead>
                    <TableHead className='font-bold'>Rejected</TableHead>
                    <TableHead className='font-bold'>Avg Match Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.perJob.length > 0 ? (
                    data.perJob.map(job => (
                      <TableRow key={job.jobId}>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>
                          <Badge variant='secondary' className={jobStatusBadgeClass(job.status)}>
                            {job.status === 'closed' ? 'Closed' : 'Open'}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.totalApplicants}</TableCell>
                        <TableCell>{job.pending}</TableCell>
                        <TableCell>{job.accepted}</TableCell>
                        <TableCell>{job.rejected}</TableCell>
                        <TableCell>{job.avgMatchScore != null ? `${job.avgMatchScore}%` : 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className='text-center'>No jobs posted yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
