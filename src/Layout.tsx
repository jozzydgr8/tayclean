import { Outlet } from "react-router-dom"
import Navbar from "./Shared/Navbar"
import { Footer } from "./Shared/Footer"
import ScrollToTop from "./Shared/ScrollToTop"

export const Layout = ()=>{
    return(
        <>
        <ScrollToTop/>
        <Navbar/>
        <Outlet/>
        <Footer/>
        </>
    )
}