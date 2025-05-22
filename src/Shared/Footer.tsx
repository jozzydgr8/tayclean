import {EnvironmentOutlined, SendOutlined}from '@ant-design/icons';
import { WhatsAppOutlined } from '@ant-design/icons';
import { InstagramOutlined } from '@ant-design/icons';
import { FacebookOutlined } from '@ant-design/icons';
import { XOutlined } from '@ant-design/icons';
export const Footer = ()=>{
    return(
        <section id="footer">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4">
                    <h4>Our Locations</h4>
                        <EnvironmentOutlined/> Tay Clean 
                        <br/><br/>
                        
                    </div>

                    <div className="col-md-4">
                        <h4>Contact Section</h4>
                        Phone No: <a href=''>+234 888 888 8888</a><br/><br/>
                        Phone No: <a href=''>+234 888 888 8888</a><br/><br/>
                        Phone No: <a href=''>+234 888 888 8888</a><br/><br/>
                       
                    </div>
                        
                    <div className="col-md-4">
                        <h4>Quick Links</h4>
                        <a href=''>Call us now: +234 802 699 2881 </a>
                        <br/> <br/>
                        <a href='https://wa.link/o2oy0h'>Send Us a message on Whatsapp <SendOutlined/></a><br/> <br/>
                        <a href='#'>Our Services</a><br/><br/>
                    </div>
                </div>
                <br/> <br/>
                <div className='footer-icons'>
                    <a href='https://wa.link/o2oy0h' target='_blank'><WhatsAppOutlined/></a>
                    <a href='https://www.instagram.com/blossomcakes_delights_ng/' target='_blank'><InstagramOutlined/></a>
                    <a><FacebookOutlined/></a>
                    <a><XOutlined/></a>
                </div>
                <br/> <br/>
                <small>© Tayclean 2025</small>
            </div>
        </section>
    )
}