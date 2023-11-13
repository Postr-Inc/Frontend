export default function Footer(){
    return(
        <div className='fixed bottom-5 flex gap-5 hero flex-wrap w-full justify-evenly'>
            &copy; 2023 - Tweeter
            <button className='btn-sm btn '>Status: <span className='text-success'>Online</span></button>
            <span className=''>Download Tweeter</span>
            <span className=''>Developers</span>
         </div> 
    )
}