import { Table, Modal, Divider, Typography, Space, Select } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { UseDataContext } from "../Context/UseDataContext";
import { FlatButton } from "../Shared/FlatButton";
import { OrderHooks } from "./Hooks/OrderHooks";
import { MessageModal } from "./MessageModal";
import { useEffect, useState } from "react";
import { recurringBookingFormValues } from "../Shared/Types";
import { formatDate } from "./Hooks/formatDate";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../App";

const { Title, Text } = Typography;

export const RecurringOrder = () => {
  const { recurringBookingData } = UseDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedEmail, setSelectedEmail] = useState<string | string[]>("");
  const { getColumnSearchProps, handleRowClick, selectedRow,setIsModalVisible, isModalVisible, } = OrderHooks();
useEffect(() => {
  recurringBookingData?.forEach((item) => {
    const end = new Date(item.subscriptionEnd);
    if (end < new Date() && item.status !== "inactive") {
      // update status in Firestore
      updateDoc(doc(db, "recurringSubscriptions", item.id), {
        status: "inactive"
      });
    }
  });
}, [recurringBookingData]);


  
  const recurringemail = recurringBookingData?.map(email=>email.email)
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
    {
  title: "Status",
  dataIndex: "status",
  key: "status",
  render: (status: string) => {
    let color = "gray";
    let text = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize

    switch (status.toLowerCase()) {
      case "active":
        color = "green";
        break;
      case "inactive":
        color = "red";
        break;
      case "pending":
        color = "orange";
        break;
      // add more status cases as needed
      default:
        color = "gray";
    }

    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "12px",
          backgroundColor: color,
          color: "white",
          fontWeight: 600,
          fontSize: 12,
          textTransform: "capitalize",
          display: "inline-block",
          minWidth: 70,
          textAlign: "center",
        }}
      >
        {text}
      </span>
    );
  },
  ...getColumnSearchProps("status"),
},
    


  ];

  return (
    <>
    <div>
        <FlatButton title="send news to all recurring subscribers" onClick={()=>{
            setIsModalOpen(true);
            setSelectedEmail(recurringemail || []);
        }}
         className="successbutton" />
    </div>
    <br/>
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
                <strong>Session-Dates:</strong>
                <Select
                    style={{ width: "100%", marginTop: 8 }}
                    placeholder="Session Dates"
                    value={selectedRow.sessionDates}
                    options={selectedRow.sessionDates.map((date: string) => ({
                    label: date,
                    value: date,
                    }))}
                    disabled
                    mode="multiple"
                />
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