import { Order } from "./Order"
import { Row, Col } from "antd";
import { FlatButton } from "../Shared/FlatButton";

export const Admin = ()=>{
    return(
        <section>
            <div className="container-fluid">
                <Row gutter={[16, 24]}>
                <Col>
                    <FlatButton 
                    title="Send Newsletter" 
                    //   onClick={handleSendNewsletter} 
                    className="successbutton" 
                    />
                    {/* <SendMessage 
                    isModalOpen={isModalOpen} 
                    setIsModalOpen={setIsModalOpen} 
                    selectedEmail={selectedEmails} 
                    /> */}
                </Col>

                <Col>
                    <FlatButton 
                    title="SignOut" 
                    //   onClick={() => navigate('/admin/upload')} 
                    className="buttonsuccess" 
                    />
                </Col>
                </Row>
                <br/>
                <Order/>
            </div>
        </section>
    )
}