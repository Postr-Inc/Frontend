"use client"
import Image from 'next/image'
import Footer from '../../footer'
import { useRef, useState, useEffect } from 'react'
import { api } from '../../page'
import { useSearchParams } from 'next/navigation'

 
export default function () {
   const searchParams = useSearchParams()
  
   let curTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "darkMode" : "lightmode"
   let [param, setParam] = useState<Object>({email: searchParams.get('email') ? searchParams.get('email')?.toString() : null, name: searchParams.get('name') ? searchParams.get('name')?.toString(): null })
   let isLogin = false;
   let nameRef = useRef<any>()
   let emailRef = useRef<any>()
   let [isValidName, setIsvalid] = useState<any>(null)
   let [isValidEmail, setIsvalidEmail] = useState<any>(null)
   let [searching, setSearching] = useState(false)
   let [email, setEmail] = useState<any>( searchParams.get('email') ? searchParams.get('email')?.toString() : null) 
   let [name, setName] = useState<any>( searchParams.get('name') ? searchParams.get('name')?.toString(): null)
   let buttonRef = useRef<any>()
   async function checkname() {
 
      setSearching(true)
      setIsvalid(false)
      setIsvalidEmail(false)
      buttonRef.current.disabled = true
 
      try {
         let res = await fetch(`http://127.0.0.1:4000/validate/${name}/${email}`).then((res) => res.json())

         console.log(res)
      

         if (res.username) {
            setIsvalid('error')
       
            setSearching(false)
            nameRef.current.innerHTML = "Username already in use"
            let timeout = setTimeout(() => {
               nameRef.current.innerHTML = 'Name';
               clearTimeout(timeout);
            }, 2000);

         } 
         else if (res.email) {
            setIsvalidEmail('error')
            setSearching(false)
            emailRef.current.innerHTML = "Email already in use"
            let timeout = setTimeout(() => {
               emailRef.current.innerHTML = 'Email';
               clearTimeout(timeout);
            }, 2000);
         }
         else if(!res.name && !res.email) {
            setIsvalid(true)
            setIsvalidEmail(true)
            setSearching(false)
            buttonRef.current.disabled = false
         }

      } catch (error) {
         setIsvalid(false)
         setIsvalidEmail(false)
         setSearching(false)
      }
   }

   useEffect(()=>{
      if(name && email){
         checkname()
      }
   }, [name, email])
   function handleClientAuth() {
       
      if (!('name' in param)) {
        nameRef.current.innerHTML = 'Please input a name';
        nameRef.current.style.color = 'red';
    
        let timeout = setTimeout(() => {
          nameRef.current.style.color = 'black';
          nameRef.current.innerHTML = 'Name';
          clearTimeout(timeout);
        }, 2000);
      }
    
      else if (!('email' in param)) {
        emailRef.current.innerHTML = 'Please input a valid email';
        emailRef.current.style.color = 'red';
    
        let timeout = setTimeout(() => {
          emailRef.current.style.color = 'black';
          emailRef.current.innerHTML = 'Email';
          clearTimeout(timeout);
        }, 2000);
      }
    
      // Create a query string
      const queryString = Object.keys(param)
        .map((key) => `${key}=${encodeURIComponent(param[key])}`)
        .join('&');
    
      // Now you can use the queryString as needed
      console.log(isValidName)
       if(isValidName && isValidEmail){
          
         window.location.href = "/signup/finish?" + queryString
       }

       
    }
    

   return (
      <div className=" relative    p-5 w-screen  justify-center flex flex-col gap-5 mx-auto
      xl:w-[30vw] lg:w-[50vw]
      "  >


         <div className=' mb-12 flex flex-col gap-5  w-full'>
            <div className='flex justify-between gap-2 hero'>
               <p className='text-blue-500 cursor-pointer' onClick={() => window.location.href = "/auth/login"}>Login</p>

            </div>
            <p className=' mt-2 text-2xl w-full '>
               Create your account
            </p>

         </div>
         <label htmlFor='username' ref={nameRef}>
            Name
         </label>
         <div className='relative w-full'>
            <input name='username'  
            value={name}
            onChange={(e) => {
               setParam({ ...param, name: e.target.value })
               setName(e.target.value)
            }} onBlur={(e) => checkname(e.target.value)} type='text' className='input input-bordered w-full'></input>
            {
               searching && !isValidName ? <span className='loading loading-spinner absolute end-5 top-1/2 transform -translate-y-1/2 right-3'></span> : ""
            }
            {
               isValidName === true ? (
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
               ) : isValidName === 'error' ?
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 
   text-red-500 absolute end-5 top-1/2 transform -translate-y-1/2 right-3
   ">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>

                  : (
                     ""
                  )
            }

         </div>
         <label htmlFor='email' ref={emailRef} >
            Email
         </label>
         <div className='relative w-full'>
            <input name='username'  
            value={email}
            onChange={(e) => {
               setParam({ ...param, email: e.target.value })
               setEmail(e.target.value)
            }} onBlur={(e) => checkname()} type='text' className='input input-bordered w-full'></input>
            {
               searching && !isValidName ? <span className='loading loading-spinner absolute end-5 top-1/2 transform -translate-y-1/2 right-3'></span> : ""
            }
            {
               isValidEmail === true ? (
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
               ) : isValidEmail === 'error' ?
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 
   text-red-500 absolute end-5 top-1/2 transform -translate-y-1/2 right-3
   ">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>

                  : (
                     ""
                  )
            }

         </div>

         <button
            ref={buttonRef}
            onClick={() =>  handleClientAuth()}
            className='btn  text-white hover:bg-rose-500  bg-rose-500 relative'>
            Next
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>


         </button>

      </div>
   )
}
