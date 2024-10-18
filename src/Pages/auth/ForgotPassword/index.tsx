import { createSignal } from "solid-js";
import logo from "@/src/assets/icon_transparent.png";
import Modal from "@/src/components/Modal";
import { api } from "@/src";
export default function ForgotPassword() {
    const [error, setError] = createSignal("");
    const [email, setEmail] = createSignal("");


    function requestReset() {
        if (!email()) {
            setError("Please enter an email address.");
            return;
        }
        api.authStore
            .requestPasswordReset(email())
            .then((data: any) => {
                if (data.opCode ===  200) {
                    //@ts-ignore
                    document.getElementById("resetPasswordModal").showModal();
                } else {
                    setError(data.message);
                }
            })
            .catch((e: any) => {
                setError("An error occured. Please try again later.");
            });
    }
    return (
        <div
            class=" relative w-full p-2 xl:mt-5    justify-center flex flex-col gap-5 mx-auto xl:w-[30vw] lg:w-[50vw]">
            <img src={logo} class="w-20 h-20 mx-auto black" />
            <div class=" mb-12 flex flex-col gap-5  w-full">
                <p class=" mt-2  sm:mt-0  w-full text-3xl font-extrabold ">
                    Request a password reset.
                </p>
                <p class="text-lg">
                    Lets get you back into your account.
                </p>
            </div>
            <label for="email">Email</label>
            <div class="relative w-full">
                <input
                    name="email"
                    id="email"
                    onInput={(e: any) => setEmail(e.target.value)}
                    autocomplete="email"
                    type="email"
                    class="input rounded input-bordered w-full"
                ></input>
            </div>

            <p class="text-xs text-red-500">{error()}</p>
            <button class="btn  text-white rounded hover:bg-rose-500  bg-rose-500 relative"  onClick={requestReset}>
                Request Reset
            </button>

            <Modal id="resetPasswordModal">
                <div class="flex flex-col gap-5 p-5">
                    <p class="text-2xl font-bold">Password Reset Requested</p>
                    <p class="text-lg">Check your email for the reset link.</p>
                </div>
            </Modal>

        </div>
    )
}