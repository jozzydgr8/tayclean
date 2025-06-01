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
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../App';
import { UseDataContext } from '../Context/UseDataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from '../Shared/globals';
import { BookingForm } from './Component/BookingForm';
import { toast } from 'react-toastify';

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
  const { bookedDates } = UseDataContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const data = service.find((item) => item.id?.toString() === id);

  const [isRecurring, setIsRecurring] = useState(true);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataSubmit, setDataSubmit] = useState({}as BookingFormValues);
  const [proceedPayment, setProceedPayment] = useState(false);
  const [totalCost, setTotalCost] = useState(0);


  useEffect(() => {
    if (!data) {
      navigate('/tayclean', { replace: true });
    }
  }, [data, navigate]);

  const disabledDate = (current: Dayjs): boolean => {
  const formatted = current.format('YYYY-MM-DD');
  
  // Disable past dates
  const isPast = current && current < dayjs().startOf('day');

  // Disable already booked dates
  const isBooked = bookedDates?.some((d) => d.date === formatted)?? false;

  return isPast || isBooked;
};


  function generateRecurringDates(
    selectedWeekdays: number[],
    startDate: string,
    monthsCount: number = 3
  ): string[] {
    const result: string[] = [];
    const start = dayjs(startDate);

    for (let monthOffset = 0; monthOffset < monthsCount; monthOffset++) {
      const currentMonth = start.add(monthOffset, 'month');
      const year = currentMonth.year();
      const month = currentMonth.month(); // 0-indexed

      const datesInMonth: string[] = [];

      selectedWeekdays.forEach((weekdayIndex) => {
        let date = dayjs(new Date(year, month, 1));
        const monthEnd = date.endOf('month');

        const matchedDates: string[] = [];

        while (date.isBefore(monthEnd) || date.isSame(monthEnd, 'day')) {
          if (date.day() === weekdayIndex) {
            matchedDates.push(date.format('YYYY-MM-DD'));
          }
          date = date.add(1, 'day');
        }

        if (matchedDates.length >= 2) {
          datesInMonth.push(matchedDates[0], matchedDates[2] || matchedDates[1]);
        } else if (matchedDates.length === 1) {
          datesInMonth.push(matchedDates[0]);
        }
      });

      result.push(...datesInMonth.sort().slice(0, 2));
    }

    return result;
  }
  const calculateTotalCost = (values: BookingFormValues): number => {
  if (!values) return 0;

  if (values.bookingType === 'recurring') {
    if (selectedDays.length === 0) return 0;

    const months = values.months || 1;
    const recurringCost = data?.recurringCost || 0;

    // Generate recurring dates to count sessions (for cost calculation)
    const startDate = dayjs(values.date).format('YYYY-MM-DD');
    const recurringDates = generateRecurringDates(selectedDays, startDate, months);

    return recurringCost * recurringDates.length;
  }

  return data?.cost || 0;
};

  const onFinish = (values: BookingFormValues) => {
  setDataSubmit(values);
  const cost = calculateTotalCost(values);
  setTotalCost(cost);
  setProceedPayment(true);
};

  const handleFinish = async () => {
  if (!dataSubmit) return;
  setLoading(true);

  const values = dataSubmit;
  const selectedTime = dayjs(values.time).format('h:mm A');
  const isRecurringBooking = values.bookingType === 'recurring';

  try {
    if (isRecurringBooking) {
      // Use totalCost from state instead of recalculating
      if (selectedDays.length === 0) {
        message.error('Please select at least one day of the week.');
        setLoading(false);
        return;
      }

      const months = values.months || 1;
      const startDate = dayjs(values.date).format('YYYY-MM-DD');
      const recurringDates = generateRecurringDates(selectedDays, startDate, months);

      // (validation and Firestore writes...)

      // Use totalCost from state here
      const totalSessions = recurringDates.length;
      const recurringCost = data?.recurringCost || 0;

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
        totalSessions,
        subscriptionStart: recurringDates[0],
        subscriptionEnd: recurringDates[recurringDates.length - 1],
        sessionDates: recurringDates,
        state: 'Lagos',
        country: 'Nigeria',
        status: 'active',
      });
      toast.info(` ${values.bookingType} booking successful! for ${data?.title}`);
      message.success(`Recurring booking successful! Total: ₦${totalCost.toLocaleString()}`);
      navigate('/tayclean');
    } else {
      // (one-time booking Firestore writes...)
      toast.info(` ${values.bookingType} booking successful! for ${data?.title}`);
      message.success('Booking successful!');
      navigate('/tayclean');
    }
    navigate('/tayclean');
  } catch (error) {
    console.error('Booking error:', error);
    message.error('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
    
  }
};

  const publicKey = process.env.REACT_APP_Pay_PublicKey || 'pk_test_0e745897d2bb51a12c4fca668a094dcecd425aea'

  const componentProp = {
        email:dataSubmit.email,
        amount: totalCost * 100 ,
        metaData: {
            name:dataSubmit.name,
            phone:dataSubmit.phone
        },
        publicKey,
        text: `Pay now ₦${totalCost.toString()}`,
        onSuccess: () => {
            handleFinish();
        },
        onClose: () => {
            alert('You have closed the payment modal');
        }
    };
  // ({weekdays,data, onFinish, setIsRecurring, isRecurring, setSelectedDays, selectedDays, disabledDate, loading}:prop)=>{
  return (
    <BookingForm
    onFinish={onFinish}
    weekdays={weekdays}
    data={data}
    setIsRecurring={setIsRecurring}
    isRecurring={isRecurring}
    setSelectedDays={setSelectedDays}
    selectedDays={selectedDays}
    disabledDate={disabledDate}
    loading={loading}
    proceedPayment={proceedPayment}
    componentProp={componentProp}

    />
  );
};

export default BookingPage;
