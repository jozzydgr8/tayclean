import { Outlet } from "react-router-dom";
import { SideNav } from "../Shared/SideNav";
import ScrollToTop from "../Shared/ScrollToTop";
// import { Header } from "./shared/Header";


export default function AdminLayout(){

    return(
        
        <>
        <ScrollToTop/>
        <div className="displaygrid">
            
            {/* sidenav */}
            <div className="one">
                <SideNav/>
            </div>
            {/* Header */}
            <div className="second">
             <h1 className="text-center" style={{
                color:'#198754',
                paddingTop:'20px',
             }}>Welcome to TayCleaning Services Admin </h1>
            </div>
            {/* Outlet */}
            <div className="three">
            <Outlet/>
            </div>

        </div>
        </>
    )
}