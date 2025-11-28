import { Slash, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setquery] = useState("");

  const handleSearch = async () => {
    dispatch(setSearchedQuery(query));
    navigate("browse");
  };

  return (
    <>
      {/* TOP BANNER */}
      <div className="bg-emerald-300 py-12 sm:py-16 px-4">
        <h1 className="text-center text-3xl sm:text-4xl lg:text-6xl uppercase font-black italic text-black leading-tight">
          Your dream job,
          <br />
          just a click away!
        </h1>
      </div>

      {/* SEARCH BAR */}
      <div className="px-4 -mt-6 sm:-mt-8 mb-4">
        <div className="bg-white shadow-md rounded-2xl flex flex-col md:flex-row items-center 
                        gap-4 p-4 max-w-4xl mx-auto w-full">

          {/* ICONS — HIDDEN ON SMALL SCREENS */}
          <div className="hidden md:flex items-center gap-2 text-gray-600">
            <Search className="text-gray-600" />
            <Slash className="rotate-135 text-gray-500" />
          </div>

          {/* INPUT — NO BORDER */}
          <input
            type="text"
            onChange={(e) => setquery(e.target.value)}
            placeholder="Search the job you want . . ."
            className="flex-1 w-full px-4 py-2 rounded-md outline-none 
                       bg-white "
          />

          {/* BUTTON */}
          <Button
            className="w-full md:w-auto py-2 px-6 text-base"
            onClick={handleSearch}
          >
            Search
          </Button>

        </div>
      </div>
    </>
  );
};

export default HeroSection;
