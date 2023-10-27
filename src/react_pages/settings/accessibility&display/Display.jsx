import React, { useState } from "react";
import Bottomnav from "../../../components/Bottomnav";

export default function Settings_my_accessibility_display(){
    let accessbile = JSON.parse(localStorage.getItem('accessbile'))
    let theme = localStorage.getItem('theme')
    let [fontSize, setFontSize] = useState('text-md')
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
           text-lg
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
            Customize your prefered font size, background and icon sizing to
            your liking.
         </p>
        
        </div>
        <div className="divider h-0 p-0"></div>
        <div className="flex flex-col">
        <div
      className="flex flex-col  text-sm mb-[35px]  "
     
      
    >
       
      <div
        className={`flex flex-col
      ${
        accessbile && theme === "black"
          ? `
        text-white antialiased   drop-shadow-md not-sr-only  
        `
          : accessbile && theme === "light"
          ? `
         text-black  antialiased   drop-shadow-md not-sr-only 
        `
          : ""
      }
      `}
      >
           <h1 className={` text-xl mb-6 font-bold
          ${
           accessbile  && theme === 'black' ? `
           text-white antialiased   drop-shadow-md not-sr-only  
           ` : accessbile && theme === 'light' ?  `
            text-black  antialiased   drop-shadow-md not-sr-only 
           ` : ''
         }
         
         `}>Display</h1>
        <div className="flex flex-row ">
            <img
              src={`/icons/logo.png`}
              className="w-8 h-8 rounded-full object-cover"
              alt="post image"
            />

          <span
            className={`
           mx-2 cursor-pointer
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
            style={{ marginLeft: ".7rem", marginRight: ".5rem" }}
            
          >
            Postr
          </span>
         
            <img
              src="/icons/verified.png"
              className="mt-[.3em]"
              style={{ width: "13px", height: "13px" }}
            />
          
          <span
            className={`
            mx-2 cursor-pointer
           ${
             accessbile && theme === "black"
               ? `
             text-white antialiased   drop-shadow-md not-sr-only  
             `
               : accessbile && theme === "light"
               ? `
              text-black  antialiased   drop-shadow-md not-sr-only 
             `
               : ""
           }
          `}
          >
            @Postr
          </span>

          <div className="dropdown dropdown-left absolute end-5 ">
            <div className="flex text-sm flex-row gap-2">
              <span
                className={`
            text-sm
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
         `}
              >
               11 mins ago
              </span>
              <label
                tabIndex="0"
                className={`
                cursor-pointer
                flex
              ${
                accessbile && theme === "black"
                  ? `
                text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 text-black  antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
              >
                •••
              </label>
            </div>
             
          </div>
        </div>

        <p
          className={`mt-6 text-sm max-w-full ${
            document.documentElement.getAttribute("data-theme") === "black"
              ? "text-white"
              : "text-black"
          } break-words`}
           
        >
Postr content is very neutruel  - free speech at its finest.
</p>
      </div>
       

      <div className="flex flex-row gap-5  mt-4">
        {
          /**
           * @Icon
           * @name:  like
           * @description:  like icon
           * @function: likes_{props.id}
           */ ""
        }

        <div className="flex flex-row gap-2 items-center">
          <svg
            
            xmlns="http://www.w3.org/2000/svg"
            fill="#F13B38" 
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke= "#F13B38"
            className="w-5 h-5 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </div>

        {
          /**
           * @Icon
           * @name: comment
           * @description:  comment icon
           */ ""
        }

        <div className="flex flex-row gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`
            w-5 h-5 cursor-pointer
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
             
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
        </div>

        {
          /**
           * @Icon
           * @name: repost
           * @description: repost icon
           */ ""
        }

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`
          w-5 h-5 cursor-pointer
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
          
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
          />
        </svg>
 
          <div>
             
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`
                w-5 h-5 cursor-pointer
              ${
                accessbile && theme === "black"
                  ? `
                text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 text-black  antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
                 
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
      
          </div>
         
      </div>
      
      <div className="flex flex-row font-normal mt-2 gap-2 ">
        <span
          className={`
        ${
          accessbile && theme === "black"
            ? `
          text-white antialiased   drop-shadow-md not-sr-only  
          `
            : accessbile && theme === "light"
            ? `
           text-black  antialiased   drop-shadow-md not-sr-only 
          `
            : ""
        }
        `}
        >
          {" "}
           6 Replies
        </span>
        <span
          className={`
            text-sm
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
        >
          •
        </span>

        <span
          className={`
        ${
          accessbile && theme === "black"
            ? `
          text-white antialiased   drop-shadow-md not-sr-only  
          `
            : accessbile && theme === "light"
            ? `
           text-black  antialiased   drop-shadow-md not-sr-only 
          `
            : ""
        }
        `}
        >
          {" "}
           6 likes
        </span>
      </div>
      
       
    </div>
       
     
        </div>
    </div>
      
     <Bottomnav />
     </>
}