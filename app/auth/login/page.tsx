"use client";
import { api } from '@/app/app/page';
import { useState } from 'react';
export default function(){
    let [password, setPassword] = useState('')
    let [email, setEmail] = useState('')

    async function login(){
        try{

            
          let r = await api.authWithPassword(email, password) 
          console.log(r)
        }catch(error){
            console.log(error)
        }
    }
    return  <div className=" relative    p-5 w-screen  justify-center flex flex-col gap-5 mx-auto
    xl:w-[30vw] lg:w-[50vw]
    "  >


       <div className=' mb-12 flex flex-col gap-5  w-full'>
          <p className=' mt-2 text-2xl w-full '>
             Sign in to Tweeter
          </p>

       </div>
       <label htmlFor='email' >
          Email
       </label>
       <div className='relative w-full'>
          <input name='email'  
         
           type='email' className='input input-bordered w-full'></input>
       
           

       </div>
       <label htmlFor='password'>
          Password
       </label>
     

       <input name='password' type='password' className='input input-bordered w-full'></input>

       <button
           
          className='btn  text-white hover:bg-rose-500  bg-rose-500 relative'>
          Login
        


       </button>

    </div>
}