export default function RateLimited(props:any){
    return (
         <div className="mt-36 flex flex-col gap-5">
            <p className="text-xl font-bold">Rate Limit Exceeded</p>
            <p className="text-xl flex flex-col">
              Please wait a few moments then try again.
            </p>
            
            
        </div>
    )
}