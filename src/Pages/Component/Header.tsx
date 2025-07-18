import { useEffect } from 'react';
import housebackground from '../../assets/housebackground.jpg'
import { service } from "../../Shared/globals"
import { Link } from 'react-router-dom';
import { FlatButton } from '../../Shared/FlatButton';
import {DownOutlined} from '@ant-design/icons'


export const Header= ()=>{
    useEffect(()=>{
        var container = document.querySelector('.headerWrite');
        
        container?.classList.add('sectionAnimationLeft');
       
    },[])
    const styles = {
        background:{
            backgroundImage:`url(${housebackground})`,
            backgroundPosition:'center center',
            backgroundSize:'cover',
            backgroundRepeat:'no-repeat',
            
        }
    }
    return(
        <section style={{...styles.background,textAlign:'center', color:"white"}}>
            <div className="container-fluid">
                <div style={{display:"flex", alignItems:'center', justifyContent:'center', flexDirection:"column",minHeight:'70vh',}} >
                    <h1 className='headerWrite'>Tay's Cleaning Service</h1>
                    {/* <h3>Residential and Commercial Cleaning Service in Lagos</h3> */}
                    <div className="servicegrid">
                        {
                            service.map((data, index)=>(
                                <div key={index} style={{textTransform:'uppercase'}}>
                                    <Link to={`${data.id}`}>
                                    {data.service}
                                    </Link>
                                </div>
                            ))
                        }
    
                        

                    </div>
                    <br/>
                    {/* <div className="servicegridsecond">
                        {
                            services.slice(5,services.length).map((services, index)=>(
                                <div key={index} className={index.toString()}>
                                    {services}
                                </div>
                            ))
                        }
                    </div> */}
                <div><a href='/#service'><FlatButton title='Learn More About Our Services ' icon={<DownOutlined/>} className='successbutton btn-lg'/></a></div>
                </div>

                
            </div>
        </section>
    )
}