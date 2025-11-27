import { Slash, Search } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import {useNavigate} from "react-router-dom"
const HeroSection = () => {
const dispatch=useDispatch()
const navigate=useNavigate()
const [query, setquery] = useState("")
const handleSearch=async ()=>{
      dispatch(setSearchedQuery(query))
      navigate("browse")
}
  return (
    <>
      <div className="bg-emerald-300 py-16 px-4 mb-[-27px]">
       
        <h1 className="text-center text-3xl sm:text-4xl lg:text-6xl uppercase font-black italic text-black leading-tight ">
          Your dream job ,<br /> just a click away!
        </h1>

      </div>

      <div className="relative  px-4  ">
        <div className="bg-gray-50   shadow-md rounded-2xl flex flex-col md:flex-row items-center gap-4 p-4 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Search className="text-gray-600" />
            <Slash className="rotate-135 text-gray-500" />
          </div>

          <input
            type="text"
            onChange={(e)=>setquery(e.target.value)}
            placeholder="Search the job you want . . . "
            className="flex-1 w-full px-4 py-2  rounded-md outline-0"
          />

          <Button className="w-full md:w-auto" onClick={handleSearch}  >Search</Button>

        </div>
      </div>
    </>
  );
};

export default HeroSection;
