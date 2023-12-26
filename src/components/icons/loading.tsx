 
import { memo } from "react"

export const  Loading = memo(function Loading(props: any){
  return(
    <div className={`flex  flex-col gap-4 w-full 
     
    xl:p-2  lg:p-2 md:p-2
    ${
      props.media ? "rounded h-44 p-0" : "mb-16"
    }`
    
    }>
    <div className={`skeleton 
    ${props.className ? props.className : "h-42"}
    ${
      props.media ? "rounded" : "rounded-none"
    }
    w-full`}>

      
    </div>
     {
      props.hiderows ? null : (<> 
        <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
      </>
      )
     }
  </div>
  )
})

 
 
 