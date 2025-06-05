import { Table, Modal, Divider, Typography, Space } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { UseDataContext } from "../Context/UseDataContext";
import { FlatButton } from "../Shared/FlatButton";
import { OrderHooks } from "./Hooks/OrderHooks";
import { MessageModal } from "./MessageModal";
import { useState } from "react";
import { BookingFormValues } from "../Shared/Types";
import { formatDate } from "./Hooks/formatDate";

const { Title, Text } = Typography;

export const Order = () => {
  const { bookingData } = UseDataContext();
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date:string) => formatDate(date),

      ...getColumnSearchProps("id"),
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
  title: "Type",
  dataIndex: "bookingType",
  key: "bookingType",
  render: (type: string) => {
  const lowerType = type?.toLowerCase();
  return (
    <span
      style={{
        color: lowerType === "recurring" ? "green" : "gray",
        fontWeight: 600,
      }}
    >
      {lowerType === "recurring" ? "Recurring" : "One-time"}
    </span>
  );
},
  filters: [
    { text: 'Recurring', value: 'recurring' },
    { text: 'One-time', value: 'one-time' }
  ],
  onFilter: (value: any, record: BookingFormValues) =>
    record.bookingType?.toLowerCase() === value
,}


  ];

  return (
    <>
      <Table
      style={{cursor:'pointer'}}
        dataSource={bookingData || []}
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
        title="Order Details"
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
                {/* <strong>Date:</strong> {new Date(selectedRow.date).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })} */}
                {selectedRow.date}
              </Text>
              <br/>
              <Text>
                <strong>Preferred Time:</strong> {selectedRow.time}
              </Text>
              <br/>
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
            </div>

            <Divider />

            <Text>
                <strong>Total Price:</strong> ₦{selectedRow.totalPrice}
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