import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  message,
  Row,
  Col,
  Card,
  Divider,
  Button,
  TimePicker,
  Radio,
  Select,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { FormProps } from 'antd';
import { BookingFormValues } from '../Shared/Types';
import { doc, setDoc } from 'firebase/firestore';
import { bookingDateRef, bookingDataRef, recurringSubscriptionsRef, db } from '../App';
import { UseDataContext } from '../Context/UseDataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from '../Shared/globals';

const BookingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { bookedDates } = UseDataContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const data = service.find((item) => item.id?.toString() === id);
  const [isRecurring, setIsRecurring] = useState(true);

  useEffect(() => {
    if (!data) {
      navigate('/tayclean', { replace: true });
    }
  }, [data, navigate]);

  const disabledDate = (current: Dayjs): boolean => {
    const formatted = current.format('YYYY-MM-DD');
    return bookedDates?.some((d) => d.date === formatted) || false;
  };

  const onFinish: FormProps<BookingFormValues>['onFinish'] = async (values) => {
    setLoading(true);
    const selectedDate = dayjs(values.date);
    const selectedTime = dayjs(values.time).format('h:mm A');
    const isRecurringBooking = values.bookingType === 'recurring';
    const numberOfMonths = values.months;

    try {
      if (isRecurringBooking) {
        const recurringDates: string[] = [];

        for (let i = 0; i < numberOfMonths; i++) {
          const firstOfMonth = selectedDate.add(i, 'month').date(5);
          const secondOfMonth = selectedDate.add(i, 'month').date(20);
          recurringDates.push(firstOfMonth.format('YYYY-MM-DD'));
          recurringDates.push(secondOfMonth.format('YYYY-MM-DD'));
        }

        const isAnyDateBooked = recurringDates.some((date) =>
          bookedDates?.some((d) => d.date === date)
        );

        if (isAnyDateBooked) {
          message.error('One or more selected recurring dates are already booked.');
          setLoading(false);
          return;
        }

        const recurringCost = data?.recurringCost || 0;
        const totalCost = recurringCost * numberOfMonths * 2;

        for (const date of recurringDates) {
          await setDoc(doc(db, 'bookingDates', date), { date });
          await setDoc(doc(db, 'bookingData', `${values.email}_${date}`), {
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
            date,
            time: selectedTime,
            state: 'Lagos',
            country: 'Nigeria',
            title: data?.title,
            totalPrice: recurringCost,
            bookingType: 'Recurring',
            isRecurring: true,
          });
        }

        await setDoc(doc(db, 'recurringSubscriptions', `${values.email}_${recurringDates[0]}`), {
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          serviceId: data?.id,
          title: data?.title,
          recurringCost,
          totalCost,
          numberOfMonths,
          totalSessions: numberOfMonths * 2,
          subscriptionStart: recurringDates[0],
          subscriptionEnd: recurringDates[recurringDates.length - 1],
          sessionDates: recurringDates,
          state: 'Lagos',
          country: 'Nigeria',
          status: 'active',
        });

        message.success(`Recurring booking successful! Total: ₦${totalCost.toLocaleString()}`);
        navigate('/tayclean');
      } else {
        const formattedDate = selectedDate.format('YYYY-MM-DD');

        if (bookedDates?.some((d) => d.date === formattedDate)) {
          message.error('Sorry, this date is already booked.');
          setLoading(false);
          return;
        }

        await setDoc(doc(db, 'bookingDates', formattedDate), { date: formattedDate });
        await setDoc(doc(db, 'bookingData', `${values.email}_${formattedDate}`), {
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          date: formattedDate,
          time: selectedTime,
          state: 'Lagos',
          country: 'Nigeria',
          title: data?.title,
          totalPrice: data?.cost,
          bookingType: 'One-Time',
        });

        message.success('Booking successful!');
        navigate('/tayclean');
      }
    } catch (error) {
      console.error('Booking error:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '40px 20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <Card
          title={`Book Service: ${data?.title}`}
          bordered={false}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Divider orientation="left">Booking Type</Divider>

            <Form.Item label="Booking Type" name="bookingType" initialValue="recurring">
              <Radio.Group onChange={(e) => setIsRecurring(e.target.value === 'recurring')}>
                <Radio value="recurring">Recurring (2x / month)</Radio>
                <Radio value="one-time">One-Time</Radio>
              </Radio.Group>
            </Form.Item>

            {isRecurring && (
              <Form.Item
                name="months"
                label="For how many months?"
                rules={[{ required: true, message: 'Please select duration in months' }]}
              >
                <Select placeholder="Select number of months" style={{ width: '100%' }}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <Select.Option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'month' : 'months'}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const months = getFieldValue('months');
                const bookingType = getFieldValue('bookingType');
                const oneTimeCost = data?.cost || 0;
                const recurringCost = data?.recurringCost || 0;
                const totalRecurring =
                  months && bookingType === 'recurring' ? months * 2 * recurringCost : 0;

                return (
                  <div style={{ marginBottom: '20px', fontWeight: 'bold', color: '#444' }}>
                    {bookingType === 'recurring' && months && (
                      <div>Total Recurring Cost: ₦{totalRecurring.toLocaleString()}</div>
                    )}
                    {bookingType === 'one-time' && (
                      <div>Total One-Time Cost: ₦{oneTimeCost.toLocaleString()}</div>
                    )}
                  </div>
                );
              }}
            </Form.Item>

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
              label="Preferred Start Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker
                allowClear={false}
                inputReadOnly
                disabledDate={disabledDate}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="time"
              label="Preferred Time"
              rules={[{ required: true, message: 'Please select a preferred time' }]}
            >
              <TimePicker
                allowClear={false}
                inputReadOnly
                use12Hours
                format="h:mm A"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ background: '#2ac1aa', color: 'white' }}
                htmlType="submit"
                block
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Book Cleaning'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </section>
  );
};

export default BookingPage;
