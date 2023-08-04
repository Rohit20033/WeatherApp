import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Weather from './Weather'
import DailyForcast from './DailyForcast'

function AllRoutes() {
  return (
   <Routes>
    <Route path='/' element={<Weather/>}/>
    <Route path='/daily' element={<DailyForcast/>}/>
   </Routes>
  )
}

export default AllRoutes