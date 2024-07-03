export default function Modal(props: { id: string, height?: string, width?: string, className?: string, children: any, style?: any}) {
    return (
        <>
            <dialog
            style={props.style}
            id={props.id} className={`sm:modal 
              ${
                theme === 'dark' ? 'bg-black ' : 'bg-white '
              }
              xl:rounded-box  
              
              `}
            
            >
                <div 
                style={{width: props.width, height: props.height}}
                className={`       shadow-none  
                  ${props.className}
                `}>
                          {props.children}
               
                           
                </div>
                 
            </dialog>
        </>
    )
}