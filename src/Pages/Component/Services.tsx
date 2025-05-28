import { Link } from "react-router-dom"
import { FlatButton } from "../../Shared/FlatButton"
import { service } from "../../Shared/globals"

export const Services = ()=>{
    return(
        <section>
            <div className="container-fluid">
                <div className="servicegrid">
                {
                    service.map((service, index)=>(
                        <Link to={`${service.id}`}
                        key={index} className='servicegridcontent' style={{ border:'solid 1px #d7d9d6', color:"black", borderRadius:"20px", background:'white'}}>
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
                        </Link>
                    ))
                }
                    
                </div>
            </div>
        </section>
    )
}