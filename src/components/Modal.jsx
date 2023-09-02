export default function Modal(props) {
    return (
        <>
            <dialog id={props.id} className={`modal  w-screen  modal-bottom sm:modal-middle  `}
            
            >
                <form method="dialog" className={`modal-box  rounded-non bg-white  w-screen
                
                   ${props.height ? props.height : 'h-[100vh]'}
                `}
                
                 
                >
                {props.children}
                  

                  
                </form>
            </dialog>
        </>
    )
}