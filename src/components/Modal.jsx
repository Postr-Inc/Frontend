export default function Modal(props) {
    return (
        <>
            <dialog id={props.id} className={`modal    modal-bottom sm:modal-middle
              `}
            
            >
                <form method="dialog" className={`modal-box    rounded-non bg-base-100
                
                   ${props.height ? props.height : 'h-[100vh]'}
                `}
                
                 
                >
                {props.children}
                  

                  
                </form>
            </dialog>
        </>
    )
}