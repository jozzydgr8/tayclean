import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { FormProps } from 'antd';
import { BookingFormValues } from '../Shared/Types';



const BookingPage: React.FC = () => {
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  const onFinish: FormProps<BookingFormValues>['onFinish'] = (values) => {
    const selectedDate = dayjs(values.date).format('YYYY-MM-DD');

    if (bookedDates.includes(selectedDate)) {
      message.error('Sorry, this date is already booked.');
      return;
    }

    setBookedDates([...bookedDates, selectedDate]);
    message.success('Booking successful!');

    console.log({
      name: values.name,
      email: values.email,
      date: selectedDate,
    });
  };

  const disabledDate = (current: Dayjs) => {
    return bookedDates.includes(dayjs(current).format('YYYY-MM-DD'));
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: 'auto' }}
    >
      <Form.Item
        name="name"
        label="Full Name"
        rules={[{ required: true, message: 'Please enter your name' }]}
      >
        <Input placeholder="Your Name" />
      </Form.Item>

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
        <Button type="primary" htmlType="submit" block>
          Book Cleaning
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookingPage;
