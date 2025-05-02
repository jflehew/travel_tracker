import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './components/Login'
import { Header } from './components/Header'
import { Register} from './components/Register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace/>}/>
        <Route path='/register' element={ <Register/>}/>
        <Route path='/login' element={ <Login/> }/>
      </Routes>
      
    </>
  )
}

export default App
