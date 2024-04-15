import React, { useEffect, useState, useRef } from 'react';
import GoogleButton from 'react-google-button'
import { NavLink } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext';
import AuthProvider from '../context/AuthContext';
import { signIn } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
const Login=()=> {
  const emailRef = useRef()
    const passwordRef = useRef()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {googleSignIn}= useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        
       
        try {
            setError('');
            setLoading(true);
            await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
            navigate('/todo')
            } catch (err) {
                setError('Login Failed')
                
            }
            setLoading(false);
    }

    const handleGoogleSignIn = async () => {
      try {
        setError('');
        setLoading(true);
        await googleSignIn();
        navigate('/todo'); 
      } catch (error) {
        console.error('Google Sign-In Failed', error);
      }
      setLoading(false);
    };
  return (
    <AuthProvider><div className='bg-black h-[100vh]'>
        <div className="title text-[white] tracking-[5px] text-[50px] font-semibold flex items-center justify-center py-12 ">
            CHECKMATE
        </div>
        <div className="login-form-wrap  w-fit text-center rounded-[6px] shadow-[0px_30px_50px_0px_rgba(0,0,0,0.2)] m-auto pt-8">
        <h2 className='font-bold text-center text-[1.9rem] text-white mb-[25px]'>Login</h2>
        <form className="login-form  px-[70px] py-0" onSubmit={handleSubmit} >
          <input
            type="email"
            placeholder="Email Address"
            ref={emailRef}
            required
          />
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            required
          />
          <input type="submit" value="Login" />
        </form>
        <div className='other text-white font-[650] mb-4'>
          <p>OR</p>
          <div className='G flex w-full justify-center mt-1' onClick={handleGoogleSignIn} ><GoogleButton type='light' /></div>
        </div>
        <div className="create-account-wrap rounded-[7px] bg-[#eeedf1] text-[#8a8b8e] text-sm w-full cursor-pointer px-0 py-2.5 rounded-[0_0_4px_4px];
">
          <p>
            Not a member? <NavLink to="/signup"><span className='hover:text-[royalblue] underline text-[purple]'>Create Account</span></NavLink>
          </p>
        </div>
      </div>
    </div></AuthProvider>
  )
}

export default Login