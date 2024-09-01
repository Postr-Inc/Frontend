import { createSignal } from "solid-js"
import Logo from "@/src/assets/icon_transparent.png"
export default function Registration() {
    let [isTyping, setIsTyping] = createSignal(false);
    let [email, setEmail] = createSignal("");
    let [password, setPassword] = createSignal("");
    let [confirmPassword, setConfirmPassword] = createSignal("");
    return (
        <div class="p-5">
            <div class="flex justify-center">
                <img src={Logo} class="w-20 h-20" alt="logo" />
            </div>
            <div class="flex justify-center">
                <h1 class="text-3xl">Register</h1>
            </div>
            <div class="mt-5">
                <input type="email" placeholder="Email" class="w-full p-2 border-2 border-gray-200" />
            </div>
            <div class="mt-5">
                <input type="password" placeholder="Password" class="w-full p-2 border-2 border-gray-200" />
            </div>
            <div class="mt-5">
                <input type="password" placeholder="Confirm Password" class="w-full p-2 border-2 border-gray-200" />
            </div>
            <div class="mt-5">
                <button class="w-full bg-blue-500 text-white p-2">Register</button>
            </div>
        </div>
    )
}