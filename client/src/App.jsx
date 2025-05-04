import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './components/Login'
import { Header } from './components/Header'
import { Register} from './components/Register'
import { Dashboard } from './components/Dashboard'
import { PublicRoute } from './context/PublicRoute'
import { PrivateRoute } from './context/PrivateRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace/>}/>
        <Route element={<PublicRoute/>}>
          <Route path='/register' element={ <Register/>}/>
          <Route path='/login' element={ <Login/> }/>
        </Route>
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={ <Dashboard/> }/>
        </Route>
      </Routes>
    </>
  )
}

export default App
