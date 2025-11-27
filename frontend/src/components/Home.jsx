import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJob from './LatestJob'
import Footer from './Footer'

import useGetAllJob from './hooks/useGetAllJob'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Testimonials from './Testimonials'


const Home = () => {
  const navigate=useNavigate()
  const {user}=useSelector(store=>store.auth)
  useEffect(() => {
      if(user?.role==='recruiter'){
          navigate("/admin/companies")
      }
  }, [])
  
  useGetAllJob()
  return (
    <div>

      <Navbar/>
      <HeroSection/>
      <CategoryCarousel/>
      <LatestJob/>
      <Testimonials/>

      <Footer/>
      {/* <Timepass/> */}
    </div>
  )
}

export default Home
