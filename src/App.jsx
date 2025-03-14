import { useState } from 'react'
import Home from './pages/Home'
import { LandingPage } from './pages/Demo'
import Login from './pages/Login'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <Home/>  */}
    {/* <LandingPage/> */}
    <Login/>
    </>
  )
}

export default App
