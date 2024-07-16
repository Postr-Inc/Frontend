import {   api }from "../../api/api";

export default function Premium(){
    let isAPremiumMember = api.authStore.model().postr_plus
    return (
        !isAPremiumMember ? <div className="justify-center  flex text-center mx-auto">
        <div className="justify-center flex flex-col gap-3 text-center  ">
        <h1 
        className="text-6xl text-sans font-bold text-center text-[#121212] mt-20"
        >Subscribe to Postr Premium</h1>
        <p className="w-[50rem]" >
          Get access to new features before everyone, a sleek badge and heatfelt commendment for becoming a supporter of the project.
        </p>
       </div>
        </div>:
        <div className="justify-center  flex text-center mx-auto">
            <h1>
                You are a premium member
            </h1>
        </div>
    )
}