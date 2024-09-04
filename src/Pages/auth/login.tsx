import { A } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import useAuth from "../../Utils/Hooks/useAuth";
import { api } from "../..";
import Page from "@/src/Utils/Shared/Page";
import useNavigation from "@/src/Utils/Hooks/useNavigation";
import logo from "@/src/assets/icon_transparent.png";
import { joinClass } from "@/src/Utils/Joinclass";
import useTheme from "@/src/Utils/Hooks/useTheme";
import useDevice from "@/src/Utils/Hooks/useDevice";
import Modal from "@/src/components/Modal";
import RegisterModal from "@/src/Utils/Modals/RegisterModal";
export default function Login() {
  const { navigate, params } = useNavigation("/auth/login");
  const { isAuthenticated, isLoading, error, login } = useAuth();
  const { theme } = useTheme();
  let { mobile } = useDevice();
  let [isTyping, setIsTyping] = createSignal(false);
  createEffect(() => { 
    api.getIP()
    if (isAuthenticated()) {
      navigate("/", null);
    } else if (error()) {
      console.log("Error", error());
    }

    let typingTimeout: any;

    function startTyping() {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setIsTyping(true);
 
    }

    function stopTyping() {
      clearTimeout(typingTimeout);
      setIsTyping(false);
    }

    function handleKeydown(e: KeyboardEvent) {
      if(e.key === "Enter") {
        setIsTyping(false);
        login(
          (document.querySelector("#email") as HTMLInputElement)?.value as string,
          (document.querySelector("#password") as HTMLInputElement)?.value as string
        );
        
      }
      startTyping();
    }

    function handleClick() {
      stopTyping();
    }

    // Attach event listeners
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("click", handleClick);
  });
  return (
    <>
      <div class="hero bg-base-200 w-screen p-0o min-h-screen">
        <div class="hero-content flex-col lg:flex-row">
        <img
            src={logo}
            class={joinClass(
              "max-w-xl rounded-lg sm:w-[120px] sm:hidden  xsm:w-[120px] xsm:hidden",
              theme() === "light" && "black"
            )}
          />
          <div>
            <div
              class=" relative w-full     justify-center flex flex-col gap-5 mx-auto xl:w-[30vw] lg:w-[50vw]">
              <div class=" mb-12 flex flex-col gap-5  w-full">
                <p class=" mt-2  sm:mt-0  w-full text-3xl font-extrabold ">
                  Open Source Is Simply Better.
                </p>
                <p class="text-lg">
                  Join the community building a safer, more secure social space.
                </p>
              </div>
              <label for="email">Email</label>
              <div class="relative w-full">
                <input
                  name="email"
                  id="email"
                  autocomplete="email"
                  type="email"
                  class="input rounded input-bordered w-full"
                ></input>
              </div>
              <label for="password">Password</label>

              <input
                name="password"
                id="password"
                autocomplete="password"
                type="password"
                class="input rounded input-bordered w-full"
              ></input>

              <button
                onClick={() => {
                  login(
                    (document.querySelector("#email") as HTMLInputElement)
                      ?.value as string,
                    (document.querySelector("#password") as HTMLInputElement)
                      ?.value as string
                  );
                }}
                class="btn  text-white rounded hover:bg-rose-500  bg-rose-500 relative"
              >
                {isLoading() ? "Loading..." : "Sign in"}
              </button>

              <p class="text-xs text-red-500">{error()}</p>
              <p class="text-xs">
                Forgot your password?{" "}
                <button
                  onClick={() => navigate("/auth/forgot", null)}
                  class="text-blue "
                >
                  Reset it
                </button>
              </p>
              <div class="">
                <p class="text-xs">
                  Don't have an account?{" "}
                  <button
                    onClick={() =>  document.getElementById("register")?.showModal()}
                    class="text-blue-500"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

       <RegisterModal />
    </>
  );
}
