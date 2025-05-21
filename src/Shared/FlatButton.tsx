
import { JSX } from "react"

type props = {
    title?:string,
    onClick:()=>void,
    className?:string,
    disabled?: boolean,
    children?: JSX.Element,
}
export const FlatButton = ({title, onClick, className, disabled, children}:props)=>{
    return(
        <button className={`btn btn-md  ${className}`} onClick={onClick} disabled={disabled} >{title} {children}</button>
    )
}
