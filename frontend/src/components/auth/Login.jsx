import React from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import {Link,useNavigate} from 'react-router-dom'
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useDispatch } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { useSelector } from 'react-redux';
// import { store } from '@/redux/store';
// import { Loader } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const dispatch=useDispatch()
  const loading=useSelector(store=>store.auth.loading)
  const navigate=useNavigate()
  const [user, setuser] = useState({email:'',password:'',role:''})
  const handlechange=(e)=>{
    console.log(e.target.value)
      setuser(prev=>({...prev,[e.target.name]:e.target.value}))
  }
 
   const handlesubmit=async(e)=>{
      e.preventDefault();
      try{
        dispatch(setLoading(true))
        // const formData= new FormData()
        // // formData.append("fullname",user.fullname)
        
        // formData.append("password",user.password)
        // formData.append("email",user.email)
        // // formData.append("phoneNumber",user.phoneno)
        // formData.append("role",user.role)
        // // if(user.file){
        // //       formData.append("file",user.file)
        // // }
        const res=await axios.post(`${USER_API_END_POINT}/login`,user,{
          headers:{
            "Content-Type":"application/json"
          },
          withCredentials:true
        })
        if(res.data.success){
          console.log("User in Navbar:", user);

          dispatch(setUser(res.data.user))
          toast.success(res.data.message)
          setTimeout(() => {
            
            navigate('/')
          }, 1000);
        }
        else{
         toast.error(res.data.message) 
        }


      }catch(error){
        if (error.response) {
    console.error("Server Error:", error.response.data);
    toast.error(error.response.data.message || "Login failed.");
  } else if (error.request) {
    console.error("No Response from Server:", error.request);
    toast.error("No response from server.");
  } else {
    console.error("Error Setting Up Request:", error.message);
    toast.error("Something went wrong.");
  }
      }
      finally{
        dispatch(setLoading(false))
      }
    }
  return (<>
    <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-4 bg-white rounded-3xl shadow-md flex flex-col mt-[-100px]">
       
            <img src="./src/assets/whiteLogo.png" className='w-20 m-auto' alt="" />
        {/* </div> */}
        {/* <p className='text-center'>Jobify</p> */}
       <h1 className='text-2xl text-center mb-5'>Jobify</h1>
        <input
         value={user.email}
          type="text"
          name="email"
          placeholder="Email"
          className="border rounded px-3 py-2 mb-5"
          onChange={handlechange}
        />

        {/* <label htmlFor="password">Password:</label> */}
        <input
        value={user.password}
          name="password"
          type="password"
          placeholder="Password"
          className="border rounded px-3 py-2 mb-5"
          onChange={handlechange}
        />

        {/* <label htmlFor="jobRole">Select your Role:</label> */}
        <select id="role" name="role"  className="border rounded px-3 py-2 mb-5"  
        value={user.role}
        onChange={handlechange}
        >
          <option value="" disabled>Select Role</option>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>
        {
          (loading)?<Button variant="outline" className="mb-5 w-full " ><Loader2 className='animate-spin h-4 w-4 mr-2'/>Please wait</Button>: <Button variant="outline" className="mb-5 w-full hover:text-white hover:bg-gradient-to-r hover:from-[#2A7B9B] hover:via-[#57C785] hover:to-[#EDDD53] " onClick={handlesubmit} >Log In</Button>
        }
       
        <Link to="/signup"><Button variant="link">Create new Account ?</Button></Link>
      </div>
    </div>
     <ToastContainer
         autoClose={1000}
         />
    </>
  );
};

export default Login;
