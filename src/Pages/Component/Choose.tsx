import {CheckOutlined, GlobalOutlined, StarOutlined} from '@ant-design/icons'
import { FaLeaf } from 'react-icons/fa';
export const Choose = ()=>{
    const styles ={
        contents:{
            display:'flex',
            gap:'15px',
            alignItems:'center',
            margin:"15px 0"
        },
        icons:{
            fontSize:'24px',
            color:'#2ac1aa'
            
        }
    }
    return(
        <section>
            <div className="container-fluid">
                <h2>Why Choose Us?</h2>
                <div className="row">
                    <div className="col-md-6">
                        <div style={styles.contents}>
                            <CheckOutlined style={styles.icons}/>
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
                            <GlobalOutlined style={styles.icons}/>
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
                            <StarOutlined style={styles.icons}/>
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