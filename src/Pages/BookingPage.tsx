import React, { useEffect } from 'react';
import { Form, Input, DatePicker, message, Row, Col, Card, Divider, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { FormProps } from 'antd';
import { BookingFormValues } from '../Shared/Types';
import { addDoc } from 'firebase/firestore';
import { bookingDateRef, bookingDataRef } from '../App';
import { UseDataContext } from '../Context/UseDataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from '../Shared/globals';
import { FlatButton } from '../Shared/FlatButton';

const BookingPage: React.FC = () => {
  const { bookedDates } = UseDataContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const data = service.find((item) => item.id?.toString() === id);

  useEffect(() => {
    if (!data) {
      navigate('/tayclean', { replace: true });
    }
  }, [data, navigate]);

  const onFinish: FormProps<BookingFormValues>['onFinish'] = async (values) => {
    const selectedDate = dayjs(values.date).format('YYYY-MM-DD');

    if (bookedDates?.some((d) => d.date === selectedDate)) {
      message.error('Sorry, this date is already booked.');
      return;
    }

    try {
      await addDoc(bookingDateRef, { date: selectedDate });

      await addDoc(bookingDataRef, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        date: selectedDate,
        state: 'Lagos',
        country: 'Nigeria',
      });

      message.success('Booking successful!');
    } catch (error) {
      console.error('Booking error:', error);
      message.error('Something went wrong. Please try again.');
    }
  };

  const disabledDate = (current: Dayjs): boolean => {
    const formatted = current.format('YYYY-MM-DD');
    return bookedDates?.some((d) => d.date === formatted) || false;
  };

  return (
    <section style={{ padding: '40px 20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <Card title={`Book Service: ${data?.title}`} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Form layout="vertical" onFinish={onFinish}>
            <Divider orientation="left">Contact Information</Divider>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input placeholder="Your Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email address' },
                  ]}
                >
                  <Input placeholder="you@example.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                  <Input type="tel" placeholder="+234 800 000 0000" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label="State">
                  <Input value="Lagos" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label="Country">
                  <Input value="Nigeria" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Location & Date</Divider>

            <Form.Item
              name="address"
              label="Home Address"
              rules={[{ required: true, message: 'Please enter your home address' }]}
            >
              <Input.TextArea placeholder="123 Example Street, Ikeja" rows={3} />
            </Form.Item>

            <Form.Item
              name="date"
              label="Preferred Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker
                disabledDate={disabledDate}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item>
            <Button style={{background:'#587c3d', color:'white'}} htmlType="submit" block>
              Book Cleaning
            </Button>
          </Form.Item>
            
          </Form>
        </Card>
      </div>
    </section>
  );
};

export default BookingPage;
