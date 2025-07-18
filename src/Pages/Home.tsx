import { Footer } from "../Shared/Footer"
import { About } from "./Component/About"
import { Advertisement } from "./Component/Advertisement"
import { Book } from "./Component/Book"
import { Choose } from "./Component/Choose"
import { Header } from "./Component/Header"
import { Help } from "./Component/Help"
import { Services } from "./Component/Services"

export const Home = ()=>{
    return(
        <>
        
        <Header/>
        
        <Services/>
        <Advertisement/>
        <About/>
        
        
        {/* <Help/> */}
        <Choose/>
        <Book/>
        <Footer/>
        </>
    )
}