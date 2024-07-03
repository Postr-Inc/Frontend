// @ts-nocheck
import { Props } from "@/src/@types/types";
import { api } from "@/src/api/api";
export default function LogoutModal(props: Props) {
    return (
      <>
        <dialog
        style={{ 
          border: theme == 'dark' ? '1px solid #2d2d2d' : '1px solid #f9f9f9',
          borderRadius: '10px' 
        }}
          id="logout-modal"
          className={` rounded-box   modal-middle 
            
            `}
        >
          <div 
          style={{borderRadius: '10px',
            border: theme == 'dark' ? '1px solid #2d2d2d' : '1px solid #f9f9f9',
          }} 
          className={`flex p-5 xl:w-[15vw] h-[45vh] xl:h-[35vh] rounded-box items-center 
             ${
              theme === "dark" ? "bg-black text-white" : "bg-white text-black "
            }
            justify-center flex-col mx-auto`}>
            <img
              src="/icons/icon-blue.jpg"
              className="rounded"
              alt="postr logo"
              width={40}
              height={40}
            ></img>
            <p className="font-bold text-xl mt-2">Loging out of Postr?</p>
            <p className="text-sm mt-2">
              You can always log back in at any time.
            </p>
            <button
              className={`btn btn-ghost rounded-full w-full  
                ${
                  theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                }
                mt-5`}
              onClick={() => {
                props.swapPage("login");
                api.authStore.clear(); 
              }}
            >
              Logout
            </button>
            <form method="dialog" className="w-full">
              <button className="btn btn-ghost mt-5 w-full rounded-full bg-base-200 ">
                Cancel
              </button>
            </form>
          </div>
        </dialog>
      </>
    );
  }
  