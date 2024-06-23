import { Props } from "@/src/@types/types";
import Modal from "@/src/components/Modal";
import SettingsIcon from "@/src/components/icons/settings"
import IconBack from "@/src/components/icons/backarrow"
import { SideBarLeft, SideBarRight } from "@/src/components/Sidebars";
import { api } from "@/src/api/api";

export default function Settings(props: Props){
    return (
        <div className="relative xl:flex   lg:flex   xl:w-[80vw]   justify-center xl:mx-auto    ">
             
             <SideBarLeft {...props} />
             <div className="w-screen  p-5 mt-5  mx-auto flex flex-col gap-5">
              {
                /**
                 * @todo add back arrow
                 */
              }
              <h1 className="text-xl flex hero gap-2"><SettingsIcon className="w-7 h-7"></SettingsIcon>  Settings</h1>
              <div className="flex flex-col">
                <div className="flex flex-col ">
                    <h1>Account Management</h1>
                    <p className="opacity-50 text-sm">Manage your account, change password details and more</p>
                </div>
                <div className="mt-2 gap-2 flex"> 
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
                        </div> : <div className="p-5 bg-base-200">
                            <p>Status: Not Subscribed</p>
                        </div>
                    }
              </div>
             </div>
             <SideBarRight {...props} /> 
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
        </div>
    )
}