import tayImage from '../../assets/Tayclean_logo.png'
export const About = ()=>{
    const styles = {
        background:{
            background:`url(${tayImage})`,
            minHeight:'200px',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'center center',
            backgroundSize:'contain'
        },
        content:{
            minHeight:'200px'
        }
    }
    return(
        <section>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div style={styles.background} className='background' >

                        </div>
                    </div>
                    <div className="col-md-6">
                        <div>
                            <p>
                            Tay's cleaning services headquartered in Lagos State believes that every touch in your residential and Commercial
                            buildings is aimed at leaving a spotless space, suitable for your comfort and relaxation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}