export default function BottomModal(props: {id:string, height:string, children:any}){
 
 return <>
  
 <dialog id={props.id} className="modal modal-bottom xl:modal-middle  ">
   <div className={`modal-box flex flex-col bg-none opacity-100  ${props.height ? props.height : ""}`}>
     {props.children}
   </div>
 </dialog>
 </>
}