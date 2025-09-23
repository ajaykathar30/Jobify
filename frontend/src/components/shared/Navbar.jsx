import React from 'react';
import { Button } from '../ui/button';
import { Popover } from '@radix-ui/react-popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { PopoverContent } from '@radix-ui/react-popover';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { LogOut } from 'lucide-react';
import { User2 } from 'lucide-react';
import {Link,useLocation} from 'react-router-dom'
import { useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import {useParams} from 'react-router-dom'
const Navbar = () => {
  const location=useLocation()
  const params=useParams()
const dispatch=useDispatch()
  const {user}=useSelector(store=>store.auth)
const handleLogout=async (e)=>{
  // setUser(null)
  e.preventDefault()
  try {
    dispatch(setUser(null))
    const res=await axios.get(`${USER_API_END_POINT}/logout`,{withCredentials:true})
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
  console.log(params)
}
    // const user=true
  return (
    <nav className=" sticky top-0 z-50 backdrop-blur-md bg-white">
      <div className="max-w-7xl mx-auto flex py-3 justify-between items-center ">
        {/* Logo */}
        <div className="">
          <img src="/logoWithName.png" alt="Logo" className="w-50" />
        </div>

        {/* Nav Links */}
        <ul className="flex justify-between space-x-20">
          {
            user && user.role==='recruiter'?(
              <>
             <Button variant="link"className={`${location.pathname==='/admin/companies'?'underline underline-offset-4':""} text-md text-black`}><Link to="/admin/companies">Companies</Link></Button>
<Button variant="link" className={`${location.pathname==='/admin/jobs'?'underline underline-offset-4':""} text-md text-black`}><Link to='/admin/jobs'>Jobs</Link></Button>
        
              </>):(
                <>
 <Button variant="link" className={`${location.pathname==='/'?'underline underline-offset-4':""} text-md text-black`}><Link to='/'>Home</Link>
                </Button>
             <Button variant="link" className={`${location.pathname==='/jobs'?'underline underline-offset-4':""} text-md text-black`}><Link to="/jobs">Jobs</Link></Button>
             <Button variant="link" className={`${location.pathname==='/browse'?'underline underline-offset-4':""} text-md text-black`}><Link to='/browse'>Browse</Link></Button>
       
                </>
              )
          }
              </ul>
       {
        !user?(
            <div className='space-x-2'>
                 <Button variant="outline"><Link to="/login">Login</Link></Button>
                 <Button variant="outline" className="bg-emerald-400 text-black hover:bg-emerald-500">
                <Link to="/signup">Sign Up</Link></Button>
            </div>
        ):(


        <Popover>
            <PopoverTrigger asChild>
      
       <Avatar >
        <AvatarImage  className="rounded-full h-13 cursor-pointer" src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="@shadcn" />
      </Avatar>
      </PopoverTrigger>
            <PopoverContent className="w-80 m-2 p-3 border-2 rounded-3xl border-gray-300 bg-gray-100" >
                <div className='flex mb-2' >
                    <Avatar >
        <AvatarImage  className="rounded-full h-13 cursor-pointer" src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="@shadcn" />
        <h1 className='font-bold p-2'>{user?.name}</h1>
        {/* src="https://github.com/shadcn.png" */}
        <h1 className='text-muted-foreground'>{user.bio}</h1>
      </Avatar>
                </div>
                {
                  user && user.role==='student' &&(

                <div className='flex gap-2 items-center mb-2'>
                    <User2/>
                   <Button variant="link">
                    <Link to="/profile">
                    View Profile
                    </Link>
                    </Button>
                  
                </div>
                  )
                }

                <div className='flex gap-2 items-center mb-2' >
                    
                   <LogOut/>
                   <Button variant="link" onClick={handleLogout}>Log Out</Button>
                </div>
                        


            </PopoverContent>
        </Popover>)
}
      </div>
<ToastContainer/>
    </nav>
  );
};

export default Navbar;
