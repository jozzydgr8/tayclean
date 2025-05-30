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
             <h2 className="text-center" style={{
                paddingTop:'20px',
             }}>Welcome to Tay'sCleaning Services Admin </h2>
            </div>
            {/* Outlet */}
            <div className="three">
            <Outlet/>
            </div>

        </div>
        </>
    )
}