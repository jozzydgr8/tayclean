import { User } from "firebase/auth"
import { ReactNode } from "react"
import { Navigate } from "react-router-dom"

type proptype={
    user:User | null,
    children: ReactNode
}
export const ProtectedRoutes = ({children, user}:proptype)=>{
    const adminUid = process.env.REACT_APP_Accepted_Admin;
    if(!user){
       return <Navigate to={'/admin/session'}/>
    }
    if (user.uid !== adminUid) {
    return <Navigate to="/admin/session" />;
  }
    return  <>{children}</> 
}