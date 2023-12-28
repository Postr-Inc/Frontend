import { memo } from "react"

export const  Loading = memo(function Loading(props: any){
  return(
    <div className={`flex flex-col gap-4 w-full ${
      props.media ? "" : "mb-16"
    }`}>
    <div className={`skeleton 
    ${props.className ? props.className : "h-32"}
     
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

 
 
 