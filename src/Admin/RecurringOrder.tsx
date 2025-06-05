import { Table, Modal, Divider, Typography, Space } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { UseDataContext } from "../Context/UseDataContext";
import { FlatButton } from "../Shared/FlatButton";
import { OrderHooks } from "./Hooks/OrderHooks";
import { MessageModal } from "./MessageModal";
import { useState } from "react";
import { recurringBookingFormValues } from "../Shared/Types";
import { formatDate } from "./Hooks/formatDate";

const { Title, Text } = Typography;

export const RecurringOrder = () => {
  const { recurringBookingData } = UseDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const { getColumnSearchProps, handleRowClick, selectedRow,setIsModalVisible, isModalVisible, } = OrderHooks();



  
  
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Subscription start",
      dataIndex: "subscriptionStart",
      key: "date",
      render:(date:string)=>formatDate(date),
      ...getColumnSearchProps("subscriptionStart"),
    },
    {
      title: "Subscription end",
      dataIndex: "subscriptionEnd",
      key: "date",
      render:(date:string)=>formatDate(date),
      ...getColumnSearchProps("subscriptionEnd"),
    },

    {
        title: "Title",
        dataIndex: "title",
        key: "Title",
    },

    {
      title: "Message",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
      <MailOutlined
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click override
          setSelectedEmail(email);
          setIsModalOpen(true);
        }}
      />
      ),      
      ...getColumnSearchProps("email"),
    },
    


  ];

  return (
    <>
      <Table
      style={{cursor:'pointer'}}
        dataSource={recurringBookingData || []}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
          handleRowClick(record);
          setSelectedEmail(record.email);
        }
        })}
      />

      <Modal
        title="RecurringOrder Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedRow && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* Customer Info */}
            <div>
              <Title level={5}>Customer Info</Title>
              <Text>
                <strong>Subscription-Start:</strong> {formatDate(selectedRow.subscriptionStart)}
              </Text>
              <br/>
              <Text>
                <strong>Subscription-End:</strong> {formatDate(selectedRow.subscriptionEnd)}
              </Text>
              <br/>
              <Text>
                <strong>Month:</strong> {selectedRow.month}
              </Text>
              <br/>
              <Text>
                <strong>Recurring-Cost:</strong> ₦{selectedRow.recurringCost}
              </Text>
              <br />
              <Text>
                <strong>Name:</strong> {selectedRow.name}
              </Text>
              <br />
              <Text>
                <strong>Email:</strong> {selectedRow.email}
              </Text>
                <br/>
               <Text>
                <strong>Address:</strong> {selectedRow.address}
              </Text>
              <br/>
              <Text>
                <strong>Phone:</strong> <a href={`tel:${selectedRow.phone}`}>{selectedRow.phone}</a>
              </Text>
              <br/>
              <Text>
                <strong>Status:</strong> {selectedRow.status}
              </Text>
              <br/>
              <Text>
                <strong>Session-Dates:</strong>{
                    selectedRow.sessionDates.map((data:string, index:any)=>(
                        <p key={index}>{data}</p>
                    ))
                }
              </Text>
              
            </div>

            <Divider />

            <Text>
                <strong>Total Price:</strong> ₦{selectedRow.totalCost}
            </Text>

            <Divider />

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <FlatButton
                onClick={() => {}}
                className="btn-success"
                title="Settled"
              />
              <FlatButton
                onClick={()=>setIsModalOpen(true)}
                className="btn-outline-success"
                title="Message"
              />
            </div>
          </Space>
        )}
      </Modal>
      <MessageModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedEmail={selectedEmail}/>
    </>
  );
};