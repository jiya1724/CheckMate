import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link, useNavigate } from "react-router-dom"
import AuthProvider, { useAuth } from '../context/AuthContext';
import {createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from "../firebase"
import { useState ,useRef } from 'react';

const SignUp=()=> {
  const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const signup  = useAuth();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useNavigate()
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError('Passwords do not match');
            window.alert('Passwords do not match');
            passwordRef.current.value = '';
            passwordConfirmRef.current.value = '';
            return;
        }
        if (passwordRef.current.value.length < 6) {
            setError('Passwords must be 6 or more characters');
            window.alert('Passwords must be 6 or more characters');
            passwordRef.current.value = '';
            passwordConfirmRef.current.value = '';
            return;
        }

        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
            history('/');
        } catch (err) {
            setError('Failed to Register');
            console.log(err);
            window.alert('Failed to register');
            passwordRef.current.value = '';
            passwordConfirmRef.current.value = '';
        } finally {
            setLoading(false);
        }
    }

  return (
    <AuthProvider>
    <div className='m h-[100vh] flex items-center  justify-center'>
        <div className="container  items-center flex justify-center ">
      <div className="card shadow-[0_5px_10px_0_rgba(0,0,0,0.3)] w-[400px] h-auto bg-[#25273c] text-white pt-2.5 pb-[30px] px-[30px] rounded-[10px]">
        <div className="card_title  text-center p-2.5">
          <h1 className='text-[26px] font-bold'>Create Account</h1>
        </div>
        <div className="form"  >
          <form onSubmit={handleSubmit}  >
            <input className='w-full bg-[#e2e2e2] rounded text-black text-[1.2rem] mx-0 my-[15px] px-5 py-3 border-[none];
' type="text" name="username" id="username" placeholder="UserName" required  />
            <input className='w-full bg-[#e2e2e2] rounded text-black text-[1.2rem] mx-0 my-[15px] px-5 py-3 border-[none];
' type="email" ref={emailRef}  name="email" placeholder="Email" required />
            <input className='w-full bg-[#e2e2e2] rounded text-black text-[1.2rem] mx-0 my-[15px] px-5 py-3 border-[none];
' type="password" ref={passwordRef} name="password" placeholder="Password" required />
            <input className='w-full bg-[#e2e2e2] rounded text-black text-[1.2rem] mx-0 my-[15px] px-5 py-3 border-[none];
' type="password"  ref={passwordConfirmRef} name="password" placeholder="Confirm Password" required  />
            <button className='bg-[#4796ff] text-white text-base w-full mt-[15px] px-[15px] py-2.5 rounded-[5px] border-[none];
' type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
        
    </div>
    </AuthProvider>
  )
}

export default SignUp