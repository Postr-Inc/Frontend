export default function Modal(props: { id: string, height?: string, width?: string, className: string, children: any}) {
    return (
        <>
            <dialog id={props.id} className={`sm:modal    xl:rounded-box  
              
              `}
            
            >
                <div 
                style={{width: props.width, height: props.height}}
                className={`  bg-base-100     shadow-none  
                  ${props.className}
                `}>
                          {props.children}
               
                           
                </div>
                 
            </dialog>
        </>
    )
}