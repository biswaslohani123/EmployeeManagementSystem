import React from 'react'
import {Toaster} from 'react-hot-toast';
import {Navigate, Route, Routes} from 'react-router-dom'
import LoginLanding from './pages/LoginLanding';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import PaySlips from './pages/PaySlips';
import Settings from './pages/Settings';
import PrintPaySlips from './pages/PrintPaySlips';

const App = () => {


  return (
    <>
      <Toaster/>
      <Routes>
        <Route path='/login' element={<LoginLanding/>} />
        <Route element={<Layout/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/employees' element={<Employees/>}/>
          <Route path='/attendance' element={<Attendance/>}/>
          <Route path='/leave' element={<Leave/>}/>
          <Route path='/payslips' element={<PaySlips/>}/>
          <Route path='/settings' element={<Settings/>}/>
        </Route>
        <Route path='/print/payslips/:id' element={<PrintPaySlips/>}/>
        <Route path='*' element={<Navigate to='/dashboard' replace/>}/>

      </Routes>
    </>
  )
}

export default App