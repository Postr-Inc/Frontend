import Modal from "@/src/components/Modal"
import Logo from "@/src/assets/logo.svg"
import useTheme from "../Hooks/useTheme"; 
import { createSignal } from "solid-js";
import { Match, Show, Switch } from "solid-js"; 
import { api } from "@/src";
import { joinClass } from "../Joinclass";
export default function RegisterModal(){
    let { theme } = useTheme();
    let [stages, setStages] = createSignal(1);
    let [email, setEmail] = createSignal("");
    let [password, setPassword] = createSignal("");
    let [dob, setDob] = createSignal("");
    let [confirmPassword, setConfirmPassword] = createSignal("");
    let [emailExists, setEmailExists] = createSignal(false);
    function checkEmail(){
        // Check if email exists 
        api.collection('users').list(1, 1, {filter: `email="${email()}"`}).then((res: any) => {
            if(res?.totalItems > 0){
                setEmailExists(true);
            }
        })
    }
    return (
        <Modal id="register" className=" xl:w-[600px]  xl:h-[600px] md:w-[600px] self-center w-full h-full flex flex-col mx-auto xl:mt-12 md:mt-12 md:rounded-xl xl:rounded-xl">
        <Modal.Content className="xl:w-[600px] xl:h-[600px] relative  md:w-[600px] md:h-1/2 w-full h-full">
           <div class="flex justify-between">
           <div class="flex justify-between"> 
            <button onClick={() => document.getElementById("register")?.close()} class="btn  btn-clear">
              X
            </button> 
            
             
          </div>
          <Switch>
                <Match when={theme() === "light"}>
                    <img src="/src/assets/icon_transparent.png" class="w-12 h-12 xl:w-20 xl:h-20 black" />
                </Match>
                <Match when={theme() === "dark"}>
                    <img src="/assets/icon_transparent.png" class="w-20 h-20" />
                </Match>
            </Switch>
            <div></div>
           </div>
          <Show when={stages() === 1}>
            <div class="flex flex-col p-5 mt-2 gap-5">
                <h1 class="flex  font-bold text-2xl  ">Create Your Account</h1>
                <label>
                    Name
                </label>
                <input type="text" class="input input-bordered" placeholder="Name" />
                <label>
                    Email
                </label>
                <input type="email" class={joinClass("input input-bordered", !emailExists ? "": "border-red-500")} placeholder="Email" onInput={(e: any) => setEmail(e.target.value)} 
                onBlur={checkEmail} /> 
                <label>
                    Date of Birth
                </label>
                <input type="date" class="input input-bordered" placeholder="Date of Birth" />
                <button onClick={() =>  emailExists() ? null : setStages(2)} class="btn rounded-full btn-primary">Next</button>
            </div>
          </Show>
          <Show when={stages() === 2}>
            <div class="flex flex-col p-5 mt-2 gap-5">
                <h1 class="flex  font-bold text-2xl  ">Create Your Account</h1>
                <label>
                    Password
                </label>
                <input type="password" class="input input-bordered" placeholder="Password" />
                <label>
                    Confirm Password
                </label>
                <input type="password" class="input input-bordered" placeholder="Confirm Password" />
                <button onClick={() => setStages(1)} class="btn rounded-full btn-primary">Back</button>
                <button class="btn rounded-full btn-primary">Register</button>
            </div>
            
            </Show>
        </Modal.Content>
      </Modal>
    )
}