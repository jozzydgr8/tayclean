import {CheckOutlined} from '@ant-design/icons'
export const Choose = ()=>{
    const styles ={
        contents:{
            display:'flex',
            gap:'15px',
            alignItems:'center',
        }
    }
    return(
        <section>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div style={styles.contents}>
                            <CheckOutlined/>
                        <div>
                            <strong>
                                Quality Service
                            </strong>
                            <br/>
                            <small>
                                We will remain consistent in delivering the desired service,
                                promptly and effectively.
                            </small>
                        </div>
                        </div>
                        <div style={styles.contents}>
                            <CheckOutlined/>
                            <div>
                                <strong>
                                    Eco-Friendly Products
                                </strong>
                                <br/>
                                <small>
                                    We will prioritize safe environments through our products to ensure living and 
                                    working spaces are condusive.
                                </small>
                            </div>
                        </div>
                        <div style={styles.contents}>
                            <CheckOutlined/>
                            <div>
                                <strong>100% Satisfaction</strong>
                                <br/>
                                <small>
                                    We will meet and exceed the expectations of our customers that ensures a high return rate in
                                    utilizing our services.
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2>Why Choose Us?</h2>
                        <p>
                            With the level of exceptional service we provide and trained staff we have, Our team is what you need 
                            to ensure your home or commercial building is in the right care.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}