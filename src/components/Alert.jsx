export default function Alert(props) {
    return (
        <div className={props.className} role="alert">
          {props.children}
        </div>
    )
}
