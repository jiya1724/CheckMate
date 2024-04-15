import React from 'react'
import Login from './pages/Login'
import SignUp from './pages/SignUp';
import ToDo from './pages/ToDo';
import AuthProvider from './context/AuthContext';
import { Router, Routes, BrowserRouter, Route } from 'react-router-dom';
function App() {
  return (
    <AuthProvider>
    <div>
        <BrowserRouter>
        <>
          <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/signup' element={< SignUp/>}></Route>
            <Route path='/todo' element={< ToDo/>}></Route>
            
          </Routes>
        </>
      </BrowserRouter>
    </div>
    </AuthProvider>
  )
}

export default App