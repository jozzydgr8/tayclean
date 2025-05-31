import {EnvironmentOutlined, SendOutlined}from '@ant-design/icons';
import { WhatsAppOutlined } from '@ant-design/icons';
import { InstagramOutlined } from '@ant-design/icons';
export const Footer = ()=>{
    return(
        <section id="footer">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4">
                    <h4>Our Locations</h4>
                        <EnvironmentOutlined/> Tay Clean Online Services
                        <br/><br/>
                        
                    </div>

                    <div className="col-md-4">
                        <h4>Contact Section</h4>
                        Email: <a href='mailto:taycleaningsservices@gmail.com'>taycleaningsservices@gmail.com</a> <br/> <br/>
                       
                    </div>
                        
                    <div className="col-md-4">
                        <h4>Quick Links</h4>
                        <a href='https://wa.link/tzom43' target='_blank'>Send Us a message on Whatsapp <SendOutlined/></a><br/> <br/>
                        <a href='#'>Our Services</a><br/><br/>
                    </div>
                </div>
                <br/> <br/>
                <div className='footer-icons'>
                    <a href='https://wa.link/tzom43' target='_blank'><WhatsAppOutlined/></a>
                    <a href='https://www.instagram.com/tayscleaningservices?igsh=aWtvbWN3ZnV3MTBn&utm_source=qr' target='_blank'><InstagramOutlined/></a>
                    
                </div>
                <br/> <br/>
                <small>© Tayclean 2025</small>
            </div>
        </section>
    )
}