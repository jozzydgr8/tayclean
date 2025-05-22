import { service } from "../../Shared/globals"

export const Services = ()=>{
    return(
        <section>
            <div className="container-fluid">
                <div className="servicegrid">
                {
                    service.map((service, index)=>(
                        <div key={index} className={index.toString()}>
                            <div style={{backgroundImage:`url(${service.image})`}}></div>
                            <div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        </div>
                    ))
                }
                    
                </div>
            </div>
        </section>
    )
}