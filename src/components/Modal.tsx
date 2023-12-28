export default function Modal(props: { id: string, height?: string, children: any}) {
    return (
        <>
            <dialog id={props.id} className={`modal    
              `}
            
            >
                <div className="max-w-screen max-w-screen h-screen bg-base-100  w-screen  overflow-x-hidden  shadow-none  
                ">
                          {props.children}
               
                           
                </div>
                 
            </dialog>
        </>
    )
}