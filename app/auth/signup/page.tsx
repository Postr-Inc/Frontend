"use client"
import Image from 'next/image'
import Footer from '../../footer'
import { useRef, useState, useEffect } from 'react'
import {  tweeter } from '../../page'
import { useSearchParams } from 'next/navigation'

 
export default function () {
   
   let [profileData, setProfileData] = useState<any>(null)
   if(tweeter.authStore.isValid) window.location.href = "/"

   async function signup(){
     let res: any = await tweeter.create({
         collection:'users', 
         record:{
         username:profileData.username,
         followers:[],
         following:[],
         password:profileData.password,
         passwordConfirm:profileData.password,
         bio: 'I am new to Tweeter'
     }})
     if(!res.error) window.location.href = "/auth/login"
   }
   return (
      <div className=" relative    p-5 w-screen  justify-center flex flex-col gap-5 mx-auto
      xl:w-[30vw] lg:w-[50vw]
      "  >
         <div className=' mb-12 flex flex-col gap-5  '>
            <div className='flex gap-2 hero justify-center'>
               <Image src="/tweeter.png" alt='postr logo' width={40} height={40}></Image>

            </div>
            <p className=' mt-2 font-bold text-1xl '>
               Open source is simply better. Signup to join the movement.
            </p>
            <label>
               <span>Username</span>
            </label>
            <input type="text" placeholder="Username" className="input input-bordered rounded-full"
            onChange={(e)=>{setProfileData({...profileData, username:e.target.value})}}
            />
            <label>
               <span>Password</span>
            </label>
            <input type="password"
            onChange={(e)=>{setProfileData({...profileData, password:e.target.value})}}
            placeholder="******" className="input input-bordered" />
            <button className="btn bg-blue-500 hover:bg-blue-500 text-white "
            onClick={()=>signup()}
            >Signup</button>
            <span className="text-sm">Already have an account? <a href="/auth/login" className="text-blue-500">Login</a></span>
            <p className='text-sm'>
               By signing up you are agree to comply with the <span className='text-rose-500'>Terms</span> and
               <span className='text-rose-500'> Privacy Policy</span>.
            </p>
            <Footer/>
         </div>
      </div>
   )
}
