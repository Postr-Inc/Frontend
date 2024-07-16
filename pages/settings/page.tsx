import { Props } from "../../src/@types/types";
import Modal from "../../src/components/Modal";
import SettingsIcon from "../../src/components/icons/settings"
import IconBack from "../../src/components/icons/backarrow"
import { useState } from "react";
import { SideBarLeft, SideBarRight } from "../../src/components/Sidebars";
import { api } from "../../src/api/api";
import Page from "../../src/components/shared/page";

export default function Settings(props: Props){
   if(typeof window === "undefined") return null
   let [shouldNotify, setShouldNotify] = useState(localStorage.getItem("notify") === "true" ? true : false);
   
    return (
      <Page 
      {...props}>
  <div className=" xl:w-[35vw]
         md:w-[50vw]  xl:p-0 p-2  mt-5  mx-auto flex flex-col gap-5">
              {
                /**
                 * @todo add back arrow
                 */
              }
              <div className="flex hero gap-5">
              <div className="hover:border-slate-200 hover:bg-white btn-ghost btn btn-circle btn-sm bg-white">
            <svg
              onClick={() => {
                 props.goBack()
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="xl:w-6 xl:h-6 w-5 h-5 cursor-pointer
           
              
             "
            >
              <path
                fill-rule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
              <h1 className="text-xl flex hero gap-2"> Settings</h1>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col ">
                    <h1>Account Management</h1>
                    <p className="opacity-50 text-sm">Manage your account, change password details and more</p>
                </div>
                <div className="mt-4 gap-2 flex"> 
                  <button className="btn-ghost btn-sm rounded-full border-slate-200"
                  onClick={()=>{
                    //@ts-ignore
                    document.getElementById("change_password")?.showModal()
                  }}
                  >Change Password</button>
                  <button className="btn-ghost btn-sm rounded-full border-slate-200">Request Account Data</button>
                </div>  
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex">
                    <h1>Manage Subscriptions</h1>
                    
                </div>
                {
                        api.authStore.model().postr_plus ? <div className="p-5 bg-base-200 rounded-xl">
                            <p className="from-blue-500 to-purple-500 bg-gradient-to-r  text-transparent bg-clip-text font-bold">Postr++</p>
                            <p>Status: Subscribed</p>
                            <p>Next Payment: 6/25/2024</p>
                        </div> : <div className="p-5 rounded-xl bg-base-200">
                            <p>Status: Not Subscribed</p>
                        </div>
                    }
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex">
                    <h1>Post Notifications</h1> 
                     
                </div>
                <span className="hero flex gap-2 mt-2">
                    <input type="checkbox" className="toggle toggle-accent" switch 
                    checked={shouldNotify}
                    onChange={()=>{
                        setShouldNotify(!shouldNotify);
                        localStorage.setItem("notify", shouldNotify ? "false" : "true")
                    }}
                    />
                    <label>{shouldNotify ? "Disable" : "Enable"} Notifications</label>
                </span>
              </div>
             </div>
             <Modal  id="change_password" 
             
             className="xl:h-[400px] md:h-[400px] h-[390px] xl:w-[500px] md:w-[500px] rounded-md"
             >
                <form method="dialog">
                <div className="w-full flex flex-col gap-5 p-5">
                    <div className="flex justify-between">
                    <h1>Change Password</h1>
                    <button type="submit" className="text-blue-500" >Cancel</button>
                    </div>
                    <input type="password" placeholder="Current Password" className="input input-bordered" ></input>
                    <label>
                        New Password
                    </label>
                    <input type="password" placeholder="New Password" className="input input-bordered"></input>
                    <input type="password" placeholder="Confirm new Password" className="input input-bordered"></input>
                    <button className="btn btn-ghost border-slate-200 ">Confirm Password Change</button>
                </div>
                </form>
             </Modal>
      </Page>
         
    )
}