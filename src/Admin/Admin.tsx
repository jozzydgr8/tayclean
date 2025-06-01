import { Order } from "./Order"
import { Row, Col } from "antd";
import { FlatButton } from "../Shared/FlatButton";
import { signOut } from "firebase/auth";
import { auth } from "../App";
import { useNavigate } from "react-router-dom";
import { UseAuthContext } from "../Context/UseAuthContext";

export const Admin = ()=>{
    const navigate = useNavigate();
    const {dispatch} = UseAuthContext();
    const handleSignOut = async()=>{
    dispatch({type:'loading', payload:true});
    try{
      await signOut(auth);
      dispatch({type:'loading', payload:false});
    }catch(error){
      console.error(error);
      dispatch({type:'loading', payload:false});
    }
  }
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
                      onClick={handleSignOut} 
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