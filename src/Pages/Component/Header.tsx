import housebackground from '../../assets/housebackground.jpg'
import { services } from "../../Shared/globals"

export const Header= ()=>{
    const styles = {
        background:{
            backgroundImage:`url(${housebackground})`,
            backgroundPosition:'center center',
            backgroundSize:'cover',
            backgroundRepeat:'no-repeat',
            
        }
    }
    return(
        <section style={{...styles.background,}}>
            <div className="container-fluid">
                <div style={{display:"flex", alignItems:'center', justifyContent:'center', flexDirection:"column",minHeight:'70vh',}} >
                    <h1>Tay Cleaning Service</h1>
                    <h3>Residential and Commercial Cleaning Service in Lagos</h3>
                    <div className="servicegrid">
                        {
                            services.map((service, index)=>(
                                <div key={index} className={index.toString()}>
                                    {service}
                                </div>
                            ))
                        }
    
                        

                    </div>
                    <br/>
                    {/* <div className="servicegridsecond">
                        {
                            services.slice(5,services.length).map((service, index)=>(
                                <div key={index} className={index.toString()}>
                                    {service}
                                </div>
                            ))
                        }
                    </div> */}
                </div>
            </div>
        </section>
    )
}