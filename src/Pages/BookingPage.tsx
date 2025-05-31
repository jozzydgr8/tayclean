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
import { db } from '../App';
import { UseDataContext } from '../Context/UseDataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from '../Shared/globals';

const weekdays = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 0 },
];

const BookingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(true);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const { bookedDates } = UseDataContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const data = service.find((item) => item.id?.toString() === id);

  useEffect(() => {
    if (!data) navigate('/tayclean', { replace: true });
  }, [data, navigate]);

  const disabledDate = (current: Dayjs): boolean => {
    const formatted = current.format('YYYY-MM-DD');
    return bookedDates?.some((d) => d.date === formatted) || false;
  };

  const generateRecurringDates = (months: number, selectedDays: number[]): string[] => {
    const dates: string[] = [];
    const today = dayjs();

    for (let i = 0; i < months; i++) {
      const start = today.add(i, 'month').startOf('month');
      const end = start.endOf('month');

      for (let d = start; d.isBefore(end); d = d.add(1, 'day')) {
        if (selectedDays.includes(d.day())) {
          dates.push(d.format('YYYY-MM-DD'));
        }
      }
    }

    return dates;
  };

  const onFinish: FormProps<BookingFormValues>['onFinish'] = async (values) => {
    setLoading(true);
    const selectedTime = dayjs(values.time).format('h:mm A');
    const isRecurringBooking = values.bookingType === 'recurring';

    try {
      if (isRecurringBooking) {
        if (selectedDays.length === 0) {
          message.error('Please select at least one day of the week.');
          setLoading(false);
          return;
        }

        const months = values.months || 1;
        const recurringDates = generateRecurringDates(months, selectedDays);

        const isAnyDateBooked = recurringDates.some((date) =>
          bookedDates?.some((d) => d.date === date)
        );

        if (isAnyDateBooked) {
          message.error('One or more selected recurring dates are already booked.');
          setLoading(false);
          return;
        }

        const recurringCost = data?.recurringCost || 0;
        const totalCost = recurringCost * recurringDates.length;

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
          numberOfMonths: months,
          totalSessions: recurringDates.length,
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
        const formattedDate = dayjs(values.date).format('YYYY-MM-DD');

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
        <Card title={`Book Service: ${data?.title}`} bordered={false}>
          <Form layout="vertical" onFinish={onFinish}>
            <Divider orientation="left">Booking Type</Divider>
            <Form.Item label="Booking Type" name="bookingType" initialValue="recurring">
              <Radio.Group onChange={(e) => setIsRecurring(e.target.value === 'recurring')}>
                <Radio value="recurring">Recurring</Radio>
                <Radio value="one-time">One-Time</Radio>
              </Radio.Group>
            </Form.Item>

            {isRecurring && (
              <>
                <Form.Item
                  name="months"
                  label="For how many months?"
                  rules={[{ required: true, message: 'Select duration in months' }]}
                >
                  <Select placeholder="Select number of months">
                    {[...Array(12)].map((_, i) => (
                      <Select.Option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'month' : 'months'}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Pick up to 2 days per week"
                  required
                  validateStatus={selectedDays.length === 0 ? 'error' : ''}
                  help={
                    selectedDays.length === 0
                      ? 'Select at least one day'
                      : selectedDays.length > 2
                      ? 'Only 2 days are allowed'
                      : ''
                  }
                >
                  <Select
                    mode="multiple"
                    placeholder="Select days"
                    value={selectedDays}
                    onChange={(val) =>
                      val.length <= 2 ? setSelectedDays(val) : message.error('Max 2 days allowed')
                    }
                    style={{ width: '100%' }}
                    options={weekdays}
                  />
                </Form.Item>
              </>
            )}

            <Divider orientation="left">Contact Info</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                  <Input placeholder="Your name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true },
                    { type: 'email', message: 'Invalid email' },
                  ]}
                >
                  <Input placeholder="you@example.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                  <Input type="tel" placeholder="+234 800 000 0000" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="State">
                  <Input value="Lagos" disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Country">
                  <Input value="Nigeria" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Location & Time</Divider>

            <Form.Item name="address" label="Home Address" rules={[{ required: true }]}>
              <Input.TextArea placeholder="123 Example Street, Ikeja" />
            </Form.Item>

            {!isRecurring && (
              <Form.Item
                name="date"
                label="Preferred Date"
                rules={[{ required: true }]}
              >
                <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
              </Form.Item>
            )}

            <Form.Item name="time" label="Preferred Time" rules={[{ required: true }]}>
              <TimePicker use12Hours format="h:mm A" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{color:"white",background:"#2ac1aa"}}
                block
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
