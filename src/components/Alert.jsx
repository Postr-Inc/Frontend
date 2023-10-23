export default function Alert(props) {
    return <div className={`alert alert-${props.type} ${props.className ? props.className : ''}
    bg-${props.bg ? props.bg : 'bg-base-200'}
    `}>
           {props.children}
       </div>
}