export default function Footer(){
    return(
        <div className=' mt-6 flex hero flex-row flex-wrap w-full   gap-5 mx-auto justify-center   xl:w-[30vw]   lg:w-[50vw]'>
            &copy; 2023 - Tweeter
            <button className='btn-sm btn '>Status: <span className='text-success'>Online</span></button>
            <span className=''>Download Tweeter</span>
            <span className=''>Developers</span>
         </div> 
    )
}