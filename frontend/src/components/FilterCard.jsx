import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
  {
    filterType: 'Location',
    array: ['Bangalore', 'Hyderabad', 'Pune', 'Delhi','Mumbai'],
  },
  {
    filterType: 'Industry',
    array: [ 'AI/ML engineer','frontend', 'backend', 'AgenticAI-dev',],
  },
  {
    filterType: 'Salary',
    array: ['0-5 LPA', '6-11 LPA', '12-25 LPA'],
  },
]

const FilterCard = () => {
  const dispatch = useDispatch()
  const [selectedValue, setSelectedValue] = useState('')

  const handleChange = (value) => {
    setSelectedValue(value)
  }

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue))
  }, [selectedValue])

  return (
<div className="w-full md:w-[240px] bg-white border border-gray-200 rounded-xl shadow-sm p-5 sticky top-24 h-fit">

      
      {/* Heading */}
    <h1 className="text-lg font-bold tracking-wide text-gray-800 mb-4">
       Filters
      </h1>


      {/* Radio Filters */}
      <RadioGroup value={selectedValue} onValueChange={handleChange}>

        {filterData.map((data, index) => (
          <div className="mb-5" key={index}>

            {/* Section Title */}
            <h2 className="text-sm text-gray-500 font-semibold uppercase mb-2">
              {data.filterType}
            </h2>

            {/* Radio Options */}
            {data.array.map((item, idx) => {
              const itemId = `r${index}-${idx}`
              return (
                <div className="flex items-center gap-2 py-1" key={idx}>
                  <RadioGroupItem value={item} id={itemId} />
                  <Label
                    htmlFor={itemId}
                    className="text-gray-800 cursor-pointer"
                  >
                    {item}
                  </Label>
                </div>
              )
            })}

          </div>
        ))}

      </RadioGroup>

      {/* Reset Button */}
      {/* <Button
        onClick={() => location.reload()}
        className="w-full mt-2"
        variant="outline"
      >
        Reset Filters
      </Button> */}
    </div>
  )
}

export default FilterCard
