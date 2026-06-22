import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import {Link,useNavigate} from 'react-router-dom'
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant.js';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

// const selector=useSelector()
const Signup = () => {
const loading=useSelector(store=>store.auth.loading)
const dispatch=useDispatch()
  const navigate=useNavigate()
    const [user, setuser] = useState({
        name:"",
        email:"",
        password:"",
        phoneno:"",
        role:"",
        file:""
    })
    const handlechange=(e)=>{
        setuser(prev=>({...prev,[e.target.name]:e.target.value}))
    }
    const changefilehandler=(e)=>{
       setuser({...user,file:e.target.files?.[0]})
    }
    const handlesubmit=async(e)=>{
      e.preventDefault();
      try{
        dispatch(setLoading(true))
        
        const formData= new FormData()
        formData.append("name",user.name)
        formData.append("password",user.password)
        formData.append("email",user.email)
        formData.append("phoneNumber",user.phoneno)
        formData.append("role",user.role)
        if(user.file){
              formData.append("file",user.file)
        }
        const res=await axios.post(`${USER_API_END_POINT}/register`,formData,{withCredentials:true})
        if(res.data.success){

          toast.success(res.data.message)
        setTimeout(() => {
          
          navigate('/login')
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
      <div className="w-full max-w-sm p-4 bg-white rounded-3xl shadow-md flex flex-col mt-[-100px] ">
       
            <img src="./src/assets/whiteLogo.png" className='w-20 m-auto' alt="" />
        {/* </div> */}
        {/* <p className='text-center'>Jobify</p> */}
       <h1 className='text-2xl text-center mb-5'>Jobify</h1>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handlechange}
          placeholder="Full name"

          className="border rounded px-3 py-2 mb-5"
        />
        <input
          type="text"
          name="phoneno"
          value={user.phoneno}
          onChange={handlechange}
          placeholder="Phone number"
          className="border rounded px-3 py-2 mb-5"
        />
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={handlechange}
          placeholder="Email"
          className="border rounded px-3 py-2 mb-5"
        />

        {/* <label htmlFor="password">Password:</label> */}
        <input
          type="password"
          name='password'
          value={user.password}
          onChange={handlechange}
          placeholder="Password"
          className="border rounded px-3 py-2 mb-5"
        />
        <select
         id="role" 
         name="role" 
         value={user.role}
        onChange={handlechange}
         className="border rounded px-3 py-2 mb-5">
          <option value="" disabled >Select Role</option>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>
<div className='flex items-center justify-around gap-4 mb-5 w-full'>
          <label htmlFor="file" className=''>Profile Pic
            <span className="text-sm text-gray-500"> (optional)</span>
          </label>
        <input
          id='file'
          type="file"
          name='file'
          onChange={changefilehandler}
          accept='image/*' 

          className="border rounded px-3 py-2 cursor-pointer w-1/2 "
        />
</div>


   {/* <label htmlFor="role" className='text-muted-foreground'>Role</label> */}
        

       {
          (loading)?<Button variant="outline" className="mb-5 w-full " ><Loader2 className='animate-spin h-4 w-4 mr-2'/>Please wait</Button>: <Button variant="outline" className="mb-5 w-full hover:text-white hover:bg-gradient-to-r hover:from-[#2A7B9B] hover:via-[#57C785] hover:to-[#EDDD53] " onClick={handlesubmit} >Sign Up</Button>
        }
        {/* <Button variant="outline" className="mb-5 hover:text-white hover:bg-gradient-to-r hover:from-[#2A7B9B] hover:via-[#57C785] hover:to-[#EDDD53]" onClick={handlesubmit}>Sign Up</Button> */}
        <Link to="/login"><Button variant="link" >Already have an account ?</Button></Link>
      </div>
    </div>
    <ToastContainer
    autoClose={1000}
    />
    </>
  );
};

export default Signup;
