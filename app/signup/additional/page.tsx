"use client";

import { api } from "@/app/page";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect} from "react";
export default function(){
   const searchParams = useSearchParams()
   if(!searchParams.get('name')  || !searchParams.get('email') ){
      window.location.href = "/signup" 
   } 
   
 

   useEffect(() => {
      api.collection('users').authRefresh()
      .then((res) => {
      
          !api.authStore.isValid 
           &&  new Date().getTime() - date.getTime() > 1000 * 60 * 60 * 24 * 7
          ? window.location.href = "/login" : null
      })
      .catch((err) => {
         api.authStore.clear()
         window.location.href = "/login"
      })
        
       
       
   }, [])

    return  <div className="relative    p-5 w-screen  justify-center flex flex-col gap-5 mx-auto
    xl:w-[30vw] lg:w-[50vw]">
     <div className='   flex flex-col gap-5   w-full'>
            
            <p className=' mt-2 text-xl w-full '>
              Edit your profile 
            </p>
            <p className="text-sm  mt-2 w-full">
               Enter it below to verify - {searchParams.get('email')}
            </p>


            <div className="relative">
            <img  src="https://picsum.photos/200" className="w-20 h-20 rounded-full object-cover" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
             className="w-6 h-6 absolute   text-blue-500">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
</svg>

            </div>
            
            <textarea></textarea>

         </div>
         
         <label>
         
         </label>
         
 
    </div>
}