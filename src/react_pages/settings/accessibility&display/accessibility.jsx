import React, { useState } from "react";
import Bottomnav from "../../../components/Bottomnav";
import { api } from "../..";
export default function Settings_my_accessibility(){
  
    let [accessbile, setaccessible] = useState(JSON.parse(localStorage.getItem('accessbile')))
    let [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme'))
 
    return <>
   <div className="flex flex-col gap-5 p-5">
   <div className="flex   flex-row justify-between">
        <span
          className={`flex flex-row items-center gap-2 cursor-pointer
          ${
            localStorage.getItem("font-size") || "text-md"
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
          text-lg
           ${
            accessbile  && theme === 'black' ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            ` : accessbile && theme === 'light' ?  `
             text-black  antialiased   drop-shadow-md not-sr-only 
            ` : ''
          }
          `}>Accessibility</span>
           
        </div>
         
      </div>
       <div className="mt-2">
        <p className={` 
        
         ${
          accessbile  && theme === 'black' ? `
          text-white antialiased   drop-shadow-md not-sr-only  
          ` : accessbile && theme === 'light' ?  `
           text-black  antialiased   drop-shadow-md not-sr-only 
          ` : ''
        }
        `}>
          Customize postr to your needs to be more accessible to you
        </p>
       
       </div>
       <div className="divider h-0 p-0"></div>
       <div className="flex flex-col">
        <h1 className={` text-md font-bold
         ${
          accessbile  && theme === 'black' ? `
          text-white antialiased   drop-shadow-md not-sr-only  
          ` : accessbile && theme === 'light' ?  `
           text-black  antialiased   drop-shadow-md not-sr-only 
          ` : ''
        }
        
        `}>Visibility</h1>
        <div className="flex justify-between mt-2">
         <p
         className={`
         ${
          accessbile  && theme === 'black' ? `
          text-white antialiased font-normal drop-shadow-md not-sr-only  
          ` : accessbile && theme === 'light' ?  `
           text-black  antialiased font-normal drop-shadow-md not-sr-only 
          ` : ''
        }
         `}
         >  Increase text contrast for increased readability.</p>
          <input data-name="accessibility checker" type="checkbox" className="toggle rounded-full   "
              {...{checked:accessbile}}
              onChange={(v)=>{
                console.log(v.value)
                 setaccessible(accessbile === true ? false : true)
                 localStorage.setItem('accessbile', !accessbile)
              }}
           />
        </div>
        <p className={`mt-2
        ${
          localStorage.getItem("font-size") || "text-md"
        } 
        ${
          accessbile  && theme === 'black' ? `
          text-white antialiased font-normal drop-shadow-md not-sr-only  
          ` : accessbile && theme === 'light' ?  `
           text-black  antialiased font-normal drop-shadow-md not-sr-only 
          ` : ''
        }
        `}>
          Improves legibility by increasing the contrast  applying antialiased optimizing for screenreaders, and dropping background shadows.
          </p>
       
       </div>
   </div>
     
    <Bottomnav />
    </>
}
