import { Props } from "@/src/@types/types";
import { SideBarLeft } from "../Sidebars";
import { SideBarRight } from "../Sidebars";
import { useState } from "react";
import LogoutModal from "../modals/logoutmodal";
export default function MainPage(props: Props){
    let [poorConnection, setPoorConnection] = useState(false);
    let [dismissToast, setDismissToast] = useState(false);
    return (
        <div 
        key={props.key}
        className="relative xl:flex   lg:flex   2xl:w-[80vw]   justify-center xl:mx-auto    ">
          <SideBarLeft 
           {...props}
          />
          {props.children}
          {poorConnection && !dismissToast ? (
            <div
              onClick={() => {
                setDismissToast(true);
              }}
              className="toast toast-end sm:toast-center  text-sm sm:hidden xsm:hidden  sm:top-0 "
            >
              <div className="alert bg-[#f82d2df5] text-white  hero flex flex-row gap-2   font-bold shadow rounded-box">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                </span>
                <p>
                  Poor connection detected.
                  <p>Likely due to your internet connection.</p>
                  <span className="text-sm"> Click to Dismiss</span>
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
          <SideBarRight
            params={props.params}
            setParams={props.setParams}
            currentPage={props.currentPage}
            swapPage={props.swapPage}
          />
           <LogoutModal {...props} />
        </div>

    )
}