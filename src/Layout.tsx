import { Outlet } from "react-router-dom"
import Navbar from "./Shared/Navbar"
import { Footer } from "./Shared/Footer"

export const Layout = ()=>{
    return(
        <>
        <Navbar/>
        <Outlet/>
        <Footer/>
        </>
    )
}