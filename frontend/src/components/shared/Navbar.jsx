import React from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast, ToastContainer } from 'react-toastify';

const Navbar = () => {
  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      dispatch(setUser(null));
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white border-b border-gray-200">
      {/* Added px-4 for mobile padding */}
      <div className="max-w-7xl mx-auto flex px-4 md:px-0 py-3 justify-between items-center">
        
        {/* Logo - Hidden on mobile (hidden), visible on medium screens and up (md:block) */}
        <div className="hidden md:block">
          <Link to="/">
            <img src="/logoWithName.png" alt="Logo" className="w-50" />
          </Link>
        </div>

        {/* Nav Links - Adjusted gap for mobile vs desktop */}
        <ul className="flex items-center gap-3 md:gap-10">
          {user && user.role === 'recruiter' ? (
            <>
              <li>
                <Link to="/admin/companies">
                  <Button variant="link" className={`${location.pathname === '/admin/companies' ? 'underline underline-offset-4' : ''} text-sm md:text-md text-black font-bold p-0 md:p-4`}>
                    Companies
                  </Button>
                </Link>
              </li>
              <li>
                <Link to='/admin/jobs'>
                  <Button variant="link" className={`${location.pathname === '/admin/jobs' ? 'underline underline-offset-4' : ''} text-sm md:text-md text-black font-bold p-0 md:p-4`}>
                    Jobs
                  </Button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to='/'>
                  <Button variant="link" className={`${location.pathname === '/' ? 'underline underline-offset-4' : ''} text-md md:text-md text-black font-bold p-0 md:p-4`}>
                    Home
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/jobs">
                  <Button variant="link" className={`${location.pathname === '/jobs' ? 'underline underline-offset-4' : ''} text-md md:text-md text-black font-bold p-0 md:p-4`}>
                    Jobs
                  </Button>
                </Link>
              </li>
              <li>
                <Link to='/browse'>
                  <Button variant="link" className={`${location.pathname === '/browse' ? 'underline underline-offset-4' : ''} text-md md:text-md text-black font-bold p-0 md:p-4`}>
                    Browse
                  </Button>
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Auth Buttons / Profile */}
        <div className="flex items-center gap-2">
          {!user ? (
            <div className='flex gap-2 items-center'>
              <Link to="/login">
                <Button variant="outline" className="text-sm md:text-base">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-emerald-400 text-black hover:bg-emerald-500 text-sm md:text-base">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage 
                    className="rounded-full w-10 h-10 object-cover" 
                    src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} 
                    alt="@shadcn" 
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 m-2 p-4 border rounded-xl bg-white shadow-lg z-50">
                <div className='flex gap-4 items-center mb-4'>
                  <Avatar className="cursor-pointer">
                    <AvatarImage 
                      className="rounded-full w-12 h-12 object-cover" 
                      src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} 
                      alt="@shadcn" 
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h1 className='font-bold text-lg'>{user?.name}</h1>
                    <p className='text-sm text-gray-500 line-clamp-1'>{user?.profile?.bio || "No bio available"}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {user && user.role === 'student' && (
                    <div className='flex gap-2 items-center w-full'>
                      <User2 className="w-4 h-4" />
                      <Link to="/profile" className="w-full">
                        <Button variant="link" className="p-0 h-auto text-black">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className='flex gap-2 items-center w-full cursor-pointer' onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    <Button variant="link" className="p-0 h-auto text-black">
                      Log Out
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;