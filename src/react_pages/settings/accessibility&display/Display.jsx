import React, { useState } from "react";
import Bottomnav from "../../../components/Bottomnav";
import Post from "../../../components/Post";

export default function Settings_my_accessibility_display(){
    let accessbile = JSON.parse(localStorage.getItem('accessbile'))
    let theme = localStorage.getItem('theme')
    let [fontSize, setFontSize] = useState(
      localStorage.getItem('font_text_size') || 'text-sm'
    )
    let [slider, setSLider] = useState(
      localStorage.getItem('fontSize') || 0
    )
    return <>
    <div className="flex flex-col gap-5 p-5">
    <div className="flex   flex-row justify-between">
         <span
           className={`flex flex-row items-center gap-2 cursor-pointer
           ${
             localStorage.getItem("font-size") ||  fontSize
           } 
           `}
         >
           <svg
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             fill="currentColor"
             onClick={() => {
               window.history.back();
             }}
             className={`w-6 h-6
             ${
               accessbile  && theme === 'black' ? `
               text-white antialiased   drop-shadow-md not-sr-only  
               ` : accessbile && theme === 'light' ?  `
                text-black  antialiased   drop-shadow-md not-sr-only 
               ` : ''
             }
             `}
           >
             <path
               fillRule="evenodd"
               d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
               clipRule="evenodd"
             />
           </svg>
         </span>
         
         <div className="flex flex-col hero">
           <span className={`font-semibold  
            text-xl
            ${
             accessbile  && theme === 'black' ? `
             text-white antialiased   drop-shadow-md not-sr-only  
             ` : accessbile && theme === 'light' ?  `
              text-black  antialiased   drop-shadow-md not-sr-only 
             ` : ''
           }
           `}>Display & Language</span>
            
         </div>
     
         
       </div>
       <p
       className={fontSize == 'text-2xl' ? 'text-xl' :  fontSize}
       >
       Change background color, font size, language and font variation.
            </p>
            <p 
            className={` text-xl
             
            font-bold`}
            >Display</p>
       <div className="flex flex-col  mt-6 gap-2 ">
   
       <Post
                  fontSize={fontSize}
                  file={null}
                  author={{
                    username:'postr',
                    id: Math.random(),
                    avatar: '/icons/logo.png'
                  }}
                  likes={['2', '2', '2', '2']}
                  expandedlikes={null}
                  verified={true}
                  comments={[]}
                  content={`Hello world`}
                  tags={[]}
                  id={Math.random().toString()}
                  created={Date.now()}
                  bookmarked={null}
                  color={'black'}
                />
             
             
       
    </div>
       
         <div className="flex flex-col">
          <input type="range" step="25" 
           value={slider}
          onChange={(e)=>{
            let value = parseInt(e.target.value)
            console.log(value)
            setSLider(value)
       
            if(value === 0){
              setFontSize('text-sm')
              localStorage.setItem('font_text_size', 'text-sm')
              localStorage.setItem('fontSize', value)
            }else if (value === 25 ){
              setFontSize('text-md')
              localStorage.setItem('font_text_size', 'text-md')
              localStorage.setItem('fontSize', value)
              
            }else if (value ===  50){
              setFontSize('text-lg')
              localStorage.setItem('font_text_size', 'text-lg')
              localStorage.setItem('fontSize', value)
            } else if(value === 75){
              setFontSize('text-xl')
              localStorage.setItem('font_text_size', 'text-xl')
              localStorage.setItem('fontSize', value)
            }else if(value === 100){
              setFontSize('text-2xl')
              localStorage.setItem('font_text_size', 'text-2xl')
              localStorage.setItem('fontSize', value)
            }
          }}
          />
        <div className="flex justify-between">
          <span className="text-sm">Aa</span>
          <span className="text-xl">Aa</span>
        </div>
         </div>
       </div>
       
      
     <Bottomnav />
     </>
}