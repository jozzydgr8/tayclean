import tayImage from '../../assets/Tayclean_logo.png'
export const About = ()=>{
    const styles = {
        background:{
            background:`url(${tayImage})`,
            
        }
    }
    return(
        <section>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div style={styles.background} className='background'>

                        </div>
                    </div>
                    <div className="col-md-6">
                        <div>
                            <p>
                                TayClean is your trusted cleaning partner, delivering top-quality residential, 
                                commercial, and specialist cleaning services across Lagos. 
                                From sparkling homes to spotless office spaces, we go above and beyond to make your environment shine. 
                                Our trained professionals use eco-friendly products and efficient techniques to ensure a hygienic, fresh, 
                                and stress-free clean — every time. Whether it's regular cleaning, end-of-lease cleaning, NDIS-supported services, 
                                or deep window and oven cleaning, TayClean is here to help you enjoy a cleaner, healthier space.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}