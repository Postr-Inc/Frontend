export default function BottomModal(props: {id:string, height:string, children:any}){
 
 return <>
  
 <dialog id={props.id} className="modal modal-bottom   ">
   <div className={`modal-box bg-none opacity-100  ${props.height ? props.height : ""}`}>
     {props.children}
   </div>
 </dialog>
 </>
}