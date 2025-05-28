import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { FormProps } from 'antd';
import { BookingFormValues } from '../Shared/Types';
import { addDoc, getDocs } from 'firebase/firestore';
import { bookingDateRef, bookingDataRef } from '../App';
import { UseDataContext } from '../Context/UseDataContext';

const BookingPage: React.FC = () => {
  const {bookedDates} = UseDataContext();
  const onFinish: FormProps<BookingFormValues>['onFinish'] = async (values) => {
    const selectedDate = dayjs(values.date).format('YYYY-MM-DD');

    if (bookedDates?.some((d) => d.date === selectedDate)) {
      message.error('Sorry, this date is already booked.');
      return;
    }


    try {
      // 1. Save the booked date
      await addDoc(bookingDateRef, {
        date: selectedDate,
      });

      // 2. Save the booking form data
      await addDoc(bookingDataRef, {
        name: values.name,
        email: values.email,
        date: selectedDate,
      });

      message.success('Booking successful!');
    } catch (error) {
      console.error("Booking error:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  const disabledDate = (current: Dayjs): boolean => {
  const formatted = current.format("YYYY-MM-DD");
  return bookedDates?.some((d) => d.date === formatted) || false;
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
