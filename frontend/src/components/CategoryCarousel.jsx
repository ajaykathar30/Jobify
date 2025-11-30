import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
const category = [
  "Agentic-AI Dev",
  "Backend Developer",
  "Data Scientist",
  "Graphic Designer",
  "AI/ML Engineer",
  "Frontend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Cloud Architect",
  "Cybersecurity Analyst",
  "UI/UX Designer",
  "Product Manager",
  "Blockchain Developer",
  "Game Developer",
  "Content Writer",
  "Project Manager",
  "Embedded Systems Engineer",
];

import {useNavigate} from "react-router-dom"
const CategoryCarousel = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleSubmit=(query)=>{
                dispatch(setSearchedQuery(query))
                navigate("/browse")
    }

  return (
    <div className='hidden sm:hidden md:hidden lg:block'> 
        <Carousel className="w-full max-w-xl mx-auto mt-10 mb-10">
<CarouselContent>

                    {
                        category.map((cat,index)=>(
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={index}>
                                <Button onClick={()=>handleSubmit(cat)}>{cat}</Button>
                            </CarouselItem>
                        ))
                    }
</CarouselContent>
<CarouselPrevious></CarouselPrevious>
<CarouselNext></CarouselNext>

        </Carousel>
    </div>
  )
}

export default CategoryCarousel
