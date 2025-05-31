import cleaningequipment from '../../assets/cleaningequipments.jpg'
export const About = ()=>{
    const styles = {
        background:{
            background:`url(${cleaningequipment})`,
            minHeight:'200px',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'center center',
            backgroundSize:'cover'
        },
        content:{
            minHeight:'300px',
            display:"flex",
            justifyContent:'center',
            alignItems:"center"
        }
    }
    return(
        <section style={{background:'#587c3d', color:'white'}}>
                
                    
                
                    <div className="row" style={{padding:'0', margin:'0'}}>
                    
                        
                        <div className="col-md-6" style={{padding:"0"}}>
                        <div style={{...styles.background,height:'100%', width:"100%"}} className='background'>

                        </div>
                    </div>
                    <div  className='col-md-6' style={{...styles.content, textAlign:"center"}}>
                        
                            <div className="">
                                <h2>About Us</h2>
                                <p className='animate-right'>
                                    Tay's cleaning services headquartered in Lagos State believes that every touch in your residential and commercial
                                    buildings is aimed at leaving a spotless space, suitable for your comfort and relaxation.
                                </p>
                        
                            </div>
                    </div>
                    </div>
                
                
            
        </section>
    )
}