"use client";

import {  tweeter } from "@/app/page";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect, useState} from "react";
export default function () {
   const searchParams = useSearchParams()
   if (!searchParams.get('name') || !searchParams.get('email')) {
      window.location.href = "/signup"
   }

   let [avatar, setAvatar] = useState<any>(null)
   let [bio, setBio] = useState<any>(null)
   let [done, setDone] = useState<any>({ avatar: false, bio: false })

   let biomax = 100
   useEffect(() => {
      if (bio?.length > biomax) {
         setBio(bio.substring(0, biomax))
      }
   }, [bio])
   
   async function isNewUser(){
      let res = await fetch('http://127.0.0.1:4000/isnew/' + tweeter.authStore.model.id).then((res)=>res.json())
   
     
   }
   async function update(){
      tweeter.update({collection:'users', id:tweeter.authStore.model.id, data:{
         bio: bio,
         avatar: {isFile:true, data:Array.from(await tweeter.getAsByteArray(avatar))}
      }}).then((res)=>{
         console.log(res)
      }).catch((err)=>{
         console.log(err)
      })

       
   }

   useEffect(()=>{
      isNewUser()
   }, [])
  
 
   return <div className="   p-8  flex flex-col gap-5 xl:justify-center lg:justify-center mx-auto
    xl:w-[30vw] lg:w-[50vw]">
      <div className='   flex flex-col gap-5  '>

          <div className="flex hero justify-between">
           <div className="flex flex-col gap-2">
           <p className=' mt-2 text-xl   font-bold'>
            {!done.avatar ? 'Pick a profile picture' : 'Tell us about yourself'}
         </p>
         <p className="text-sm opacity-50">
            {!done.avatar ? 'Have a selfie? Upload it here.' : 'What makes you unique?'}
         </p>
         </div>
         {
            !done.avatar ?
            <button className="btn btn-sm bg-blue-500 hover:bg-blue-500 text-white rounded-full"
         
         onClick={()=>{
            setDone({...done, avatar:true})
         }}
         >
            Skip 
         </button>
         : ""
         }
          {
            done.avatar ? 
            <button className="btn btn-sm bg-blue-500 hover:bg-blue-500 text-white rounded-full"
         {...!avatar ? {disabled:true} : {}}
         onClick={()=>{
            if(!done.avatar && avatar){
               setDone({...done, avatar:true})
            }else{
               setDone({...done, bio:true})
            }
            done.avatar || done.bio ? update() : ""
          
         }}
         >
            Finish
         </button>
         :""
          }
          </div>
         
             {!done.avatar ?
            <div className="   flex flex-col gap-5 justify-center mx-auto mt-16  ">
            
            <div className="indicator">
               <span
                  className="indicator-item bg-base-300 rounded-full p-1 mt-2 mr-2 hover:text-sky-500 hover:cursor-pointer flex justify-start"
               ><label for="avatar"
               ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3 h-3 cursor-pointer"
               >
                        <path
                           d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
                        ></path></svg></label></span>
               <img
                  src={avatar ? URL.createObjectURL(avatar) : "/avatar.png"}
                  
                  className=" w-[8rem] h-[8rem]    rounded-full border border-1 border-base-300 avatar"
               />
            </div>
            <input type="file" id="avatar" className="hidden"
            onChange={(e)=>{
               setAvatar(e.target?.files[0])
               setDone({...done, avatar:true})
            }}
            />
         </div>
         : "" 
            }

            {
               done.avatar ?  <div
               className="relative w-full"
               >
                  <textarea 
                  value={bio}
               onChange={(e)=>{
                  setBio(e.target.value)
               }}
               className='input mt-8 
               p-2
               input-bordered h-24 resize-none    ' placeholder='Bio' name='bio' id='bio' cols={30} rows={10}></textarea>
               <span className={`text-sm opacity-50 absolute right-5 mr-3 bottom-4
               ${bio?.length > biomax ? "text-red-500" : ""}
               `}>{bio?.length || 0}/{biomax}</span>
               </div>
               : ""
            }



         </div>

     

   </div>

}