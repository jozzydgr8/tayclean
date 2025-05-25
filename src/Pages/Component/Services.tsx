import { FlatButton } from "../../Shared/FlatButton"
import { service } from "../../Shared/globals"

export const Services = ()=>{
    return(
        <section>
            <div className="container-fluid">
                <div className="servicegrid">
                {
                    service.map((service, index)=>(
                        <div key={index} className={index.toString()} style={{ border:'solid 1px #d7d9d6', color:"black", borderRadius:"20px", background:'white'}}>
                            <div style={{backgroundImage:`url(${service.image})`,
                            height:'200px', backgroundSize:"cover",
                             backgroundPosition:"center center", backgroundRepeat:"no-repeat"}}></div>
                            <div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                                <div>
                                    <FlatButton className="successbutton" onClick={()=>{}} title={`BOOK NOW - ₦${service.cost}`}/>
                                </div>
                            </div>
                        </div>
                    ))
                }
                    
                </div>
            </div>
        </section>
    )
}