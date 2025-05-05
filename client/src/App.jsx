import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './components/Login'
import { Header } from './components/Header'
import { Register} from './components/Register'
import { Dashboard } from './components/Dashboard'
import { PublicRoute } from './context/PublicRoute'
import { PrivateRoute } from './context/PrivateRoute'
import { TravelForm } from './components/TravelForm'

function App() {

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
          <Route path='/trip/add' element={ <TravelForm/> }/>
          <Route path='/dashboard' element={ <Dashboard/> }/>
          <Route path='/trip/update/:tripID' element={ <TravelForm/> }/>
        </Route>
      </Routes>
    </>
  )
}

export default App
