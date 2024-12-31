import { useState } from 'react'
import './App.css'
import Combined from './components/mainchat/combined'
import OpenSign from './components/mainchat/openSign'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Marketing from './components/marketing/combined'

const mainColor = "#00CC96"
const secondaryColor = "#00CC96"

const Comb = () => <main className='flex w-full h-screen overflow-hidden justify-center items-center'>
    <OpenSign color={mainColor}  />
    <Combined color={mainColor} secondary={secondaryColor} />
</main>


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/test" element={<Marketing color={mainColor} secondary={secondaryColor} />} />
        <Route path="/" element={<Comb></Comb>}></Route>
      </Routes>
    </Router>
  )
}

export default App
