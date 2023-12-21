export default function Modal(props: { id: string, height?: string, children: any}) {
    return (
        <>
            <dialog id={props.id} className={`sm:modal    xl:rounded-box  
              
              `}
            
            >
                <div className={`${
                    props.height ? props.height +' max-w-screen max-w-screen h-screen' : "max-w-screen max-w-screen h-screen"
                } bg-base-100     shadow-none  
                `}>
                          {props.children}
               
                           
                </div>
                 
            </dialog>
        </>
    )
}