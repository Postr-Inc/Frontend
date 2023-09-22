export default function Modal2(props) {
    return (
        <>
            <dialog id={props.id} className={`modal
              `}
            
            >
                <form method="dialog" className={`modal-box  stickt rounded-none 
                 ${props.styles ? props.styles : ''}
                `}
                
                 
                >
                {props.children}
                  

                  
                </form>
            </dialog>
        </>
    )
}
