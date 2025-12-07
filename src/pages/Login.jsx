import React, { useState } from 'react';
import loginBg from '../assets/login_background.jpg'; 
import { User,Lock, EyeClosed, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [isVisible,setIsVisible]=useState(false);
  const navigate=useNavigate();

  localStorage.clear();

  const updateEmail=(event)=>{
    setEmail(event.target.value);
  }
  const updatePassword=(event)=>{
    setPassword(event.target.value);
  }
  const validateCredential=async()=>{
    const user={email,password};
    
    const url='http://localhost:5000/api/auth/login';
    const header={
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(user)
    }
    try {
      const response=await fetch(url,header);
      if(!response.ok){
        throw new Error(response.statusText);
      }
      const data=await response.json();
      localStorage.clear();
      localStorage.setItem('token',data.token);
      localStorage.setItem('user_data',JSON.stringify(data.user));
      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {      
      toast.error(error)
    }
  }
  return (
    <div className="w-screen h-screen flex flex-row">
      <div className='w-full h-full flex flex-col justify-center items-center gap-3'>
        <h1 className='text-3xl font-bold'>Welcome back</h1>
        <h1 className='text-lg text-gray-500'>Please Enter Valid Credentials</h1>
        <div className='w-full max-w-sm flex flex-col gap-4'>
          <div 
          className='flex flex-row items-center bg-gray-50 rounded-md px-3 py-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200'>
            <User size={25} />
            <input 
            value={email}
            type='email' 
            onChange={updateEmail}
            className='w-100 rounded-sm bg-gray-50 px-2 focus:outline-none' placeholder='Enter your email'/>
          </div>
          {
            isVisible ? (
                <div 
                  className='flex flex-row fjustify-evenly items-center bg-gray-50 px-3 py-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200'>
                    <Lock size={25} />
                    <input 
                    value={password}
                    onChange={updatePassword}
                    type='password' 
                    className='w-100 rounded-sm bg-gray-50 px-2 focus:outline-none' placeholder='Enter your password'/>
                    <button 
                    onClick={()=>{setIsVisible(!isVisible)}}
                    className='border-none bg-transparent text-black'>
                      <EyeOff size={25}/>
                    </button>
                </div>
              ):(
                <div 
                  className='flex flex-row fjustify-evenly items-center bg-gray-50 px-3 py-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200'>
                    <Lock size={25} />
                    <input 
                    type='text' 
                    value={password}
                    onChange={updatePassword}
                    className='w-100 rounded-sm bg-gray-50 px-2 focus:outline-none' placeholder='Enter your password'/>
                    <button 
                    onClick={()=>{setIsVisible(!isVisible)}}
                    className='border-none bg-transparent text-black'>
                      <Eye size={25}/>
                    </button>
                </div>
              )
          }
          <div className='w-[380px] flex flex-row justify-between items-center'>
            <div className='flex flex-row justify-center items-center gap-1'>
              <input type='checkbox' className='w-4 h-4'/>
              <p>Remember Me</p>
            </div>
            <p className='text-violet-600 cursor-pointer'><a>Forgot password?</a></p>
          </div>
          <button 
          onClick={validateCredential}
          className='w-96 h-10 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-sm cursor-pointer'>Login</button>
          <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
          </div>
          <p className='text-md'>Don't Have an account <a className='text-violet-500'>Sign Up?</a></p>
        </div>
      </div>
      <div 
        className="w-full h-full bg-cover bg-center rounded-s-3xl"
        style={{ backgroundImage: `url(${loginBg})` }}
      ></div>
    </div>
  );
}

export default Login;
