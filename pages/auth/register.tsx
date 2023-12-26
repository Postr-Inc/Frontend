'use client';
import {useEffect, useRef, useState } from 'react'
import { api } from '@/src/api/api'
import Footer from '@/app/footer'
 
export default function Register(props:any) {
   let [isClient, setClient] = useState(false)
   useEffect(() => {
      if(typeof window !== "undefined") setClient(true)
   }, [])
   if(api.authStore.isValid()){
      props.swapPage('home')
   }
   let curTheme = " "
   if(typeof window !== "undefined")   curTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "darkMode" : "lightMode"
   let [btnState, setBtnState] = useState(false)

   async  function oauth(type:string){
      
       await api.oauth({provider:type, redirect_uri:'/'})
       props.setLastPage('login')
       props.swapPage('home')
   }

   useEffect(() => {
      if(!btnState){
         setTimeout(() => {
            setBtnState(false)
         }, 1000);
      }
   }, [btnState])
   return  <>
   {
      isClient ? <div>

   
      <div className=" relative    p-5 w-screen  justify-center flex flex-col gap-5 mx-auto
      xl:w-[30vw] lg:w-[50vw]
      "  
     
      >


         <div className=' mb-12 flex flex-col gap-5  '>
            <div className='flex gap-2 hero justify-center'>
               <img src="/icons/icon-blue.jpg" alt='postr logo' width={40} height={40}></img>

            </div>
            <p className=' mt-2 font-bold text-3xl '>
               Open source is simply better.
            </p>

         </div>
         <p className='mb-2 font-bold text-2xl '>
            Join the movement.
         </p>
         <button 
         onClick={()=>{setBtnState(true); oauth('google')}}
         className={
            curTheme == "darkMode" ? 'btn btn-sm bg-white rounded-full' : 'btn btn-md w-full   bg-[#121212] text-white hover:bg-[#121212] shadow font-bold  '
         }><img src='/icons/google.png' width={30} height={30}></img>Continue with google {
            btnState ? <span className='loading loading-spinner'></span> : ""
         }
         </button>
         <button className={
            curTheme == "darkMode" ? 'btn btn-sm bg-white rounded-full' : 'btn btn-md hover:border-2    w-full  text-[#121212]  bg-[#e7e8e7ea]  font-bold  '
         }><img src='/icons/apple.png' width={30} height={30}></img>Continue with  Apple
         {
            btnState ? <span className='loading loading-spinner'></span> : ""
         }
         </button>
         <p className='mt-2 mb-2 text-sm'>
            By signing up you are agree to comply with the <span className='text-rose-500'>Terms</span> and
            <span className='text-rose-500'> Privacy Policy</span>.
         </p>
         <div className='divider mt-0 h-0 before:opacity-50 after:opacity-50 after:bg-slate-200 before:rounded-full after:rounded-full'>Or</div>
         <button 
         onClick={()=> typeof window !== "undefined" ? window.location.href = "/auth/register" : null}
         className='btn  text-white hover:bg-rose-500  bg-rose-500'>
            Create Account
         </button>
         <p className='mt-2 mb-2'>
            Already have an account?  <span className='text-rose-500 cursor-pointer' onClick={()=> typeof window !== "undefined" ? window.location.href = "/auth/login" : null}>Login</span>
         </p>
        
         <Footer className="mt-16" />
      </div>
      </div> : null

   }
   </>
}
