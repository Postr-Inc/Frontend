"use client";
import { api } from "@/app/page";
import { useSearchParams } from "next/navigation"
import { useState, useRef } from "react";
export default function(){
    const searchParams = useSearchParams()
    if(!searchParams.get('name')  || !searchParams.get('email')){
       window.location.href = "/signup" 
    } 

    let [password, setPassword] = useState('')
    let passwordRef = useRef<any>()

    async function confirm(){
      if(password.length < 8 || password.length > 50){
         passwordRef.current.innerHTML = "Password must be at least 8 characters and less than 50 characters"
         passwordRef.current.style.color = "red"
         let timeout = setTimeout(() => {
            passwordRef.current.innerHTML = 'Create a password';
            passwordRef.current.style.color = "black"
            clearTimeout(timeout);
         }, 2000);
         return;
      } 
       try {
       
         await  api.collection('users').create({
            username:searchParams.get('name'),
            email:searchParams.get('email'),
            bio:'New to postr',
            password:password,
            passwordConfirm:password
          })

        let auth = await api.collection('users').authWithPassword(searchParams.get('email'), password)

        if(auth){
            window.location.href = "/signup/additional?" + searchParams.toString()
        }
       } catch (error) {
        console.log(error)
       }
    }
    return  <div className="relative    p-5 w-screen  justify-center flex flex-col gap-3 mx-auto
    xl:w-[30vw] lg:w-[50vw]">
     <div className=' mb-12 flex flex-col gap-5  w-full'>
            <div className='flex justify-between gap-2 hero'>
               <p className='text-blue-500 cursor-pointer' onClick={() => window.location.href = "/login"}>Login</p>

            </div>
            <p className=' mt-2 text-2xl w-full '>
               Create your account
            </p>
        

         </div>
         <label htmlFor='username' className="text-sm"  >
            Name
         </label>
         <div className='relative w-full'>
            <input name='username' value={searchParams.get('name')} type='text'
             onClick={()=>{
                window.location.href = "/signup?" + searchParams.toString()
             }}
             className='input input-bordered w-full placeholder:text-blue-500'></input>
            <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-6 h-6 text-green-500 absolute end-5 top-1/2 transform -translate-y-1/2 right-3"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                     />
                  </svg>

         </div>
         <label htmlFor='email' className="text-sm" >
            Email
         </label>
         <div className="relative w-full">
         <input name='email'  
          onClick={()=>{
            window.location.href = "/signup?" + searchParams.toString()
         }}
          value={searchParams.get('email')} 
         type='text' className='input input-bordered placeholder:text-blue-500 w-full'></input>
         <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-6 h-6 text-green-500 absolute end-5 top-1/2 transform -translate-y-1/2 right-3"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                     />
                  </svg>
         </div>
         
         {
            !searchParams.get('google') ?  <div>
                <label htmlFor='password'
            ref={passwordRef}
            className="text-sm" >
               Create a password
            </label>
            <div className="relative w-full">
            <input name='password' 
             
               placeholder={password}
            onChange={(e)=>{
               setPassword(e.target.value)
            }
            }
            type='password' className='input input-bordered placeholder:text-blue-500 w-full'></input>
            </div>
            </div>
            : ""
         }

         <p>
            By clicking signup you agree to follow our <a className="text-blue-500" href="/terms">Terms of Service</a> and <a className="text-blue-500" href="/privacy">Privacy Policy</a>
         </p>

         <button
            onClick={()=>confirm()}
            className='btn  text-white hover:bg-blue-500 bg-blue-500    relative'>
           Signup
            


         </button>
    </div>
}