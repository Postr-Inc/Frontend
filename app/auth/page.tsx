"use client"
import Image from 'next/image'
import Footer from '../footer'
import {useRef, useState } from 'react'
import {sdk } from '../page'
export default function Login() {
   let curTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "darkMode" : "lightmode"
   let [btnState, setBtnState] = useState(false)

   async  function oauth(type:string){
      let res = await sdk.oauth({provider:type, redirect_uri:'/'})
      console.log(res)
   }
   if(sdk.authStore.isValid) window.location.href = "/" 
   return (
      <div className=" relative    p-5 w-screen  justify-center flex flex-col gap-5 mx-auto
      xl:w-[30vw] lg:w-[50vw]
      "  >


         <div className=' mb-12 flex flex-col gap-5  '>
            <div className='flex gap-2 hero justify-center'>
               <Image src="/logo-noback.png" alt='postr logo' width={40} height={40}></Image>

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
         }><img src='/google.png' width={30} height={30}></img>Continue with google {
            btnState ? <span className='loading loading-spinner'></span> : ""
         }
         </button>
         <button className={
            curTheme == "darkMode" ? 'btn btn-sm bg-white rounded-full' : 'btn btn-md hover:border-2    w-full  text-[#121212]  bg-[#e7e8e7ea]  font-bold  '
         }><img src='/apple.png' width={30} height={30}></img>Continue with  Apple
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
         onClick={()=>window.location.href="/auth/signup"}
         className='btn  text-white hover:bg-rose-500  bg-rose-500'>
            Create Account
         </button>
         <p className='mt-2 mb-2'>
            Already have an account?  <span className='text-rose-500 cursor-pointer' onClick={()=>window.location.href="/auth/login"}>Login</span>
         </p>
        
         <Footer />
      </div>
   )
}
