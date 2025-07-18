import { Link } from "react-router-dom"
import { FlatButton } from "../../Shared/FlatButton"
import { service } from "../../Shared/globals"
import { Typography } from "antd"

export const Services = ()=>{
    const {Title} = Typography
    return(
        <section id="service">
            <div className="container-fluid">
                <h2>Our Services</h2>
                <Title style={{color:"#2ac1aa",fontFamily:'podkova', textAlign:"center"}} level={3}>Enjoy 15% off  All Recurring Bookings, Including Bi-Monthly Cleaning!</Title>
                <div className="servicegrid ">
                {
                    service.map((service, index)=>(
                        <Link
                            to={`${service.id}`}
                            key={index}
                            className="servicegridcontent animate-up"
                            style={{
                                border: 'solid 1px #d7d9d6',
                                color: 'black',
                                borderRadius: '20px',
                                background: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                textDecoration: 'none',
                            }}
                            >
                            {/* Top image section */}
                            <div
                                style={{
                                backgroundImage: `url(${service.image})`,
                                height: '200px',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                                }}
                            ></div>

                            {/* Content section */}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '15px' }}>
                                <h3 style={{ textTransform: 'capitalize' }} dangerouslySetInnerHTML={{ __html: service.title }}></h3>
                                <p>{service.description}</p>
                                
                                {/* This pushes the button to the bottom */}
                                <div style={{ marginTop: 'auto' }}>
                                <FlatButton className="successbutton" onClick={() => {}} title={`BOOK NOW - ₦${service.cost.toLocaleString()}`} />
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