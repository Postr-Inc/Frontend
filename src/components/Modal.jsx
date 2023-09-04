export default function Modal(props) {
    return (
        <>
            <dialog id={props.id} className={`modal    modal-bottom sm:modal-middle  `}
            
            >
                <form method="dialog" className={`modal-box  stickt rounded-non bg-white  
                
                   ${props.height ? props.height : 'h-[100vh]'}
                `}
                
                 
                >
                {props.children}
                  

                  
                </form>
            </dialog>
        </>
    )
}