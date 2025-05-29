import { useContext } from "react"
import { AuthContext } from "./ContextAuth"

export const UseAuthContext = ()=>{
    const context = useContext(AuthContext);
    if(!context){
        throw Error('context provider is required')
    }
    return context
}