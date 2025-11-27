import React from 'react'
import Navbar from './shared/Navbar'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Pen } from 'lucide-react'
import { Button } from './ui/button'
import { Mail } from 'lucide-react'
import { Contact } from 'lucide-react'
import { Badge } from './ui/badge'
import AppliedJobTable from './AppliedJobTable'
import { useState } from 'react'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'

const resume=true
const skills=['Html','Css','JavaScipt']
// const skills=[]
const Profile = () => {
  const [open, setopen] = useState(false)

  const {user}=useSelector(store=>store.auth)
  return (
    <div>
      <Navbar/>
     
      
        

      {/* <div>{user?.name}</div> */}

      <div className=" relative max-w-5xl m-auto rounded-3xl my-5 p-8   bg-gray-100 shadow-2xl">
    
       

        <div className='flex justify-between'>

          <div className='flex items-center justify-center gap-3'>

            <Avatar>
              <AvatarImage src={user?.profile?.profilePhoto ||  "https://github.com/shadcn.png"}  className='h-24 w-24 rounded-3xl border-2' />
            </Avatar>
            <div className=''>
              <h1 className='font-bold text-2xl mx-5'>{user?.name.toUpperCase()}</h1>
              <h1 className='text-muted-foreground font-poppins mt-1'>{user?.profile?.bio}</h1>
            </div>
          </div>
          <Button className='text-right' variant="outline" onClick={()=>setopen(true)}><Pen /></Button>

        </div>
        <div className='my-6 flex gap-2 text-xl'>
          <Mail className='mx-4' />
          <span>{user?.email}</span>
        </div>
        <div className='my-6 flex gap-2 text-xl'>
          <Contact className='mx-4'/>
          <span>{user?.phoneNumber}</span>
        </div>
        <div className='my-2 text-xl mx-4' >
          <p className='my-2'>Skills </p>

          {
            user?.profile?.skills.length!=0?user?.profile?.skills.map((item, idx) => (
              
              <Badge className='mx-0.5 my-1' key={idx}>
                {item}
              </Badge>

)):<span>NA</span>
}
        </div>
        <div className='my-4 mx-4'>
          <h1>Resume</h1>
          {
            resume?<a href={user?.profile?.resume} className='text-blue-600 hover:underline'>{user?.profile?.resumeOriginalName}</a>:<span>NA</span>
          }
        </div>
        <div className='my-3'>
         <AppliedJobTable/>
        </div>
        <UpdateProfileDialog open={open} setopen={setopen}/>

      </div>

    </div>
  )
}

export default Profile
