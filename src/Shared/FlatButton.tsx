
import { JSX } from "react"

type props = {
    title?:string,
    onClick?:()=>void,
    type?:string
    className?:string,
    disabled?: boolean,
    children?: JSX.Element,
    icon?: JSX.Element,
}

export const FlatButton = ({title, onClick, className, disabled, children, icon}:props)=>{
    return(
        <button className={`btn btn-md  ${className}`} onClick={onClick} disabled={disabled} >{title} {children} {icon}</button>
    )
}
