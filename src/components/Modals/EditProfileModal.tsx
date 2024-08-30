import { api } from "@/src";
import Modal from "../Modal";
import useTheme from "@/src/Utils/Hooks/useTheme";
import { joinClass } from "@/src/Utils/Joinclass";
import ArrowLeft from "../Icons/ArrowLeft";

export default function EditProfileModal() {
    const { theme } = useTheme();
    return (
        <dialog id="editProfileModal" class="modal rounded-md">
            <div class={joinClass("modal-content sm:w-[20rem]  w-[27rem]  rounded-xl", theme() === "dark" ? "bg-white" : "bg-white")}>
                <div class="modal-header p-3 flex justify-between">
                    <svg
                        onClick={() => document.getElementById("editProfileModal")?.close()}
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 cursor-pointer   "><path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd"></path></svg>
                    <h2>Edit Profile</h2>
                    <button class={
                        joinClass("btn btn-sm rounded-full ", theme() === "dark" ? "bg-white text-black hover:bg-black" : "bg-black text-white")
                    }>Save</button>
                </div>
                <div class="modal-body flex flex-col">
                    <div class="flex flex-col relative">
                        <img src={
                            api.cdn.getUrl("users", api.authStore.model.id, api.authStore.model.banner)
                        } alt="banner" class="w-full h-[6rem] object-cover rounded-md" />
                        <div class="absolute btn btn-circle bg-[#030303] bg-opacity-25  inset-x-0 mx-auto translate-x-0   left-[-2vw] text-white top-[30%]"><label for="change-banner"><button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6  "><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"></path></svg></button></label></div>
                        <div class="absolute top-[40px] left-2">
                            <div class="relative w-32  ">
                                <img src={api.cdn.getUrl("users", api.authStore.model.id, api.authStore.model.avatar)} alt="" class="w-20 h-20 object-cover avatar rounded  border-slate-200 border-2" />
                            </div>
                        </div>

                    </div>

                </div>
                <div class="p-3">
                    <div class="flex flex-col mt-5 gap-5 p-2">
                        <label>
                            Username
                        </label>
                        <input type="text" value={api.authStore.model.username} class={joinClass("input focus:outline-none", theme() === "dark" ? "border border-gray-800" : "border border-[#cac9c9] focus:border-[#cac9c9]")} />
                    </div>
                    <div class="flex flex-col mt-2 gap-5 p-2">
                        <label>
                            Bio
                        </label>
                        <textarea class={joinClass("input p-2 h-[4rem] focus:outline-none", theme() === "dark" ? "border border-gray-800 backdrop:" : "border border-[#cac9c9] focus:border-[#cac9c9]")}
                            value={api.authStore.model.bio}
                        ></textarea>
                    </div>
                    <div class="flex flex-col mt-2 gap-5 p-2">
                        <label>
                            Location
                        </label>
                        <input type="text"
                            value={api.authStore.model.location}
                            class={joinClass("input focus:outline-none", theme() === "dark" ? "border border-gray-800" : "border border-[#cac9c9] focus:border-[#cac9c9]")} />
                    </div>
                    <div class="flex flex-col mt-2 gap-5 p-2">
                        <label>
                            Socials
                        </label>
                        <input type="text" class={joinClass("input focus:outline-none", theme() === "dark" ? "border border-gray-800" : "border border-[#cac9c9] focus:border-[#cac9c9]")}
                            value={api.authStore.model.social}
                        />
                    </div>
                </div>
            </div>
        </dialog>
    )
}