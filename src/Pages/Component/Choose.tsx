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
            color:'#2ac1aa',
            
        },
        header:{
            background:"#a3d65e",
            padding:'3px 15px',
        }
    }
    return(
        <section>
            <div className="container-fluid">
                <h2>Why Choose Us?</h2>
                    <div>
                        
                        <p style={{textAlign:'center'}}>
                            With the level of exceptional service we provide and trained staff we have, Our team is what you need 
                            to ensure your home or commercial building is in the right care.
                        </p>
                    </div>


                    <div className='row'>
                        <div style={styles.contents} className='col-md-4'>
                            <CheckOutlined style={styles.icons}/>
                        <div>
                            <strong style={styles.header}>
                                Quality Service
                            </strong>
                            <br/>
                            <small className='animate-up'>
                                We will remain consistent in delivering the desired service,
                                promptly and effectively.
                            </small>
                        </div>
                        </div>
                        <div style={styles.contents} className='col-md-4'>
                            <GlobalOutlined style={styles.icons}/>
                            <div>
                                <strong style={styles.header}>
                                    Eco-Friendly Products
                                </strong>
                                <br/>
                                <small className='animate-up'>
                                    We will prioritize safe environments through our products to ensure living and 
                                    working spaces are condusive.
                                </small>
                            </div>
                        </div>
                        <div style={styles.contents} className='col-md-4'>
                            <StarOutlined style={styles.icons}/>
                            <div>
                                <strong style={styles.header}>100% Satisfaction</strong>
                                <br/>
                                <small className='animate-up'>
                                    We will meet and exceed the expectations of our customers that ensures a high return rate in
                                    utilizing our services.
                                </small>
                            </div>
                        </div>
                    </div>
                    
                
            </div>
        </section>
    )
}