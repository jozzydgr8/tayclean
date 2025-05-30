import { Table, Modal, Divider, Typography, Space } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { UseDataContext } from "../Context/UseDataContext";
import { FlatButton } from "../Shared/FlatButton";
import { BookingFormValues } from "../Shared/Types";
import { OrderHooks } from "./Hooks/OrderHooks";

const { Title, Text } = Typography;

export const Order = () => {
  const { bookingData } = UseDataContext();
  const { getColumnSearchProps, handleRowClick, selectedRow,setIsModalVisible, isModalVisible, } = OrderHooks();
  
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "OrderId",
      dataIndex: "id",
      key: "id",
      render: (text: string) => `${text.slice(0, 7)}...`,
      ...getColumnSearchProps("id"),
    },
    {
      title: "Message",
      dataIndex: "email",
      key: "email",
      render: () => <MailOutlined />,
      ...getColumnSearchProps("email"),
    },
  ];

  return (
    <>
      <Table
        dataSource={bookingData || []}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
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
                <strong>Date:</strong> {selectedRow.date}
              </Text>
              <br/>
              <Text>
                <strong>Time:</strong> {selectedRow.time}
              </Text>
              <br/>
              <Text>
                <strong>Name:</strong> {selectedRow.name}
              </Text>
              <br />
              <Text>
                <strong>Email:</strong> {selectedRow.email}
              </Text>
              <br />
              <Text>
                <strong>Order ID:</strong> {selectedRow.id}
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
                onClick={() => {}}
                className="btn-outline-success"
                title="Request Delivery"
              />
            </div>
          </Space>
        )}
      </Modal>
    </>
  );
};