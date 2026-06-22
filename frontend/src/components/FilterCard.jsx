import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'

const locationOptions = ['Bangalore', 'Hyderabad', 'Pune', 'Delhi', 'Mumbai']
const salaryOptions = [
  { label: '0-5 LPA', min: 0, max: 5 },
  { label: '6-11 LPA', min: 6, max: 11 },
  { label: '12-25 LPA', min: 12, max: 25 },
]

const FilterCard = ({ location, salary, onLocationChange, onSalaryChange }) => {
  const selectedSalaryLabel = salaryOptions.find(opt => opt.min === salary?.min && opt.max === salary?.max)?.label || ''

  const handleSalaryChange = (label) => {
    const option = salaryOptions.find(opt => opt.label === label)
    onSalaryChange(option ? { min: option.min, max: option.max } : null)
  }

  return (
    <div className="w-full md:w-[240px] bg-white border border-gray-200 rounded-xl shadow-sm p-5 sticky top-24 h-fit">

      {/* Heading */}
      <h1 className="text-lg font-bold tracking-wide text-gray-800 mb-4">
        Filters
      </h1>

      {/* Location */}
      <div className="mb-5">
        <h2 className="text-sm text-gray-500 font-semibold uppercase mb-2">Location</h2>
        <RadioGroup value={location} onValueChange={onLocationChange}>
          {locationOptions.map((item, idx) => (
            <div className="flex items-center gap-2 py-1" key={idx}>
              <RadioGroupItem value={item} id={`location-${idx}`} />
              <Label htmlFor={`location-${idx}`} className="text-gray-800 cursor-pointer">{item}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Salary */}
      <div className="mb-5">
        <h2 className="text-sm text-gray-500 font-semibold uppercase mb-2">Salary</h2>
        <RadioGroup value={selectedSalaryLabel} onValueChange={handleSalaryChange}>
          {salaryOptions.map((option, idx) => (
            <div className="flex items-center gap-2 py-1" key={idx}>
              <RadioGroupItem value={option.label} id={`salary-${idx}`} />
              <Label htmlFor={`salary-${idx}`} className="text-gray-800 cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

export default FilterCard
