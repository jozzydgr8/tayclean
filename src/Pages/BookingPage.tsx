import React, { useEffect, useState } from 'react';
import {
  Form,
  message,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { BookingFormValues } from '../Shared/Types';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../App';
import { UseDataContext } from '../Context/UseDataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from '../Shared/globals';
import { BookingForm } from './Component/BookingForm';
import { toast } from 'react-toastify';
import { SendMessage } from '../Shared/SendMessage';
import { Helmet } from 'react-helmet-async';

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
  const {sendEmail} = SendMessage();
  const [form] = Form.useForm();

  
  useEffect(() => {
    if (!data) {
      navigate('/', { replace: true });
    }
  }, [data, navigate]);

  const disabledDate = (current: Dayjs): boolean => {
  const formatted = current.format('YYYY-MM-DD');

  // Disallow today and past dates
  const isBeforeTomorrow = current && current < dayjs().add(1, 'day').startOf('day');

  // Disallow already booked dates
  const isBooked = bookedDates?.some((d) => d.date === formatted) ?? false;

  return isBeforeTomorrow || isBooked;
};

const disabledTime = () => {
  const disabledHours = () => {
    const hours: number[] = [];
    for (let i = 0; i < 24; i++) {
      if (i < 4 || i >= 22) {
        hours.push(i); // 0–3 (12am–3am), 22–23 (10pm–11pm)
      }
    }
    return hours;
  };

  return {
    disabledHours,
  };
};



function generateRecurringDates(
  selectedWeekdays: number[],
  startDate: string,
  monthsCount: number = 3,
  bookedDates: { date: string }[] = []
): string[] {
  const result: string[] = [];
  let current = dayjs(startDate);
  const bookedSet = new Set(bookedDates.map(d => d.date));

  if (!selectedWeekdays.includes(current.day())) {
    return result; // start date must match selected days
  }

  for (let i = 0; i < monthsCount; i++) {
    // 2 sessions per month: base + base + 14 days
    const baseDates = [current, current.add(14, 'day')];

    for (let base of baseDates) {
      let sessionDate = base;
      let found = false;

      // Try each selected day of the week within the same week
      for (let offset = 0; offset < 7; offset++) {
        const tryDate = base.add(offset, 'day');
        if (selectedWeekdays.includes(tryDate.day())) {
          const tryFormatted = tryDate.format('YYYY-MM-DD');
          if (!bookedSet.has(tryFormatted)) {
            sessionDate = tryDate;
            bookedSet.add(tryFormatted);
            result.push(tryFormatted);
            found = true;
            break;
          }
        }
      }

      // If no matching preferred day found, fall to the next free day (up to 14 tries)
      if (!found) {
        let fallback = base;
        let tries = 0;
        while (bookedSet.has(fallback.format('YYYY-MM-DD')) && tries < 14) {
          fallback = fallback.add(1, 'day');
          tries++;
        }
        const final = fallback.format('YYYY-MM-DD');
        bookedSet.add(final);
        result.push(final);
      }
    }

    // Move to next month
    current = current.add(1, 'month');
  }

  console.log(result);
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
    const recurringDates = generateRecurringDates(selectedDays, startDate, months, bookedDates??[]);

    return recurringCost * recurringDates.length;
  }

  return data?.cost || 0;
};

  const onFinish = (values: BookingFormValues) => {
  const selectedStartDay = dayjs(values.date).day(); // returns 0-6 (Sun-Sat)
  
  if (values.bookingType === 'recurring') {
    if (selectedDays.length === 0) {
      toast.error('Please select at least one day of the week.');
      return;
    }

    if (!selectedDays.includes(selectedStartDay)) {
      const selectedDayNames = selectedDays.map(d => weekdays.find(w => w.value === d)?.label).join(', ');
      toast.error(`The start date must fall on one of your selected days (${selectedDayNames}).`);
      return;
    }
  }

  const cost = calculateTotalCost(values);
  setTotalCost(cost);
  setDataSubmit(values);
  setProceedPayment(true);
};


  const handleFinish = async () => {
  if (!dataSubmit) return;
  setLoading(true);

  const values = dataSubmit;
  const selectedTime = dayjs(values.time).format('h:mm A');
  const isRecurringBooking = values.bookingType === 'recurring';
  const body = {
    recipient_email:values.email,
    message: `Hi ${values.name},\n\nThank you for choosing TayCleaning Services!\n\nYour ${values.bookingType.toLowerCase()} booking for "${data?.title}" has been successfully confirmed.\n\nWe look forward to serving you.\n\nIf you have any questions, feel free to reply to this email.\n\nBest regards,\nThe TayCleaning Team`,
    subject: `Your ${values.bookingType} Booking with TayCleaning is Confirmed!`

  }

  try {
  if (isRecurringBooking) {
    if (selectedDays.length === 0) {
      message.error('Please select at least one day of the week.');
      setLoading(false);
      return;
    }

    const months = values.months || 1;
    const startDate = dayjs(values.date).format('YYYY-MM-DD');
    const recurringDates = generateRecurringDates(selectedDays, startDate, months, bookedDates??[]);
    const totalSessions = recurringDates.length;
    const recurringCost = data?.recurringCost || 0;
    if (recurringDates.length === 0) {
      toast.error('No valid recurring dates could be generated.');
      setLoading(false);
      return;
    }
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

    console.log(`Recurring booking successful! Total: ₦${totalCost.toLocaleString()}`);
  } else {
  const date = dayjs(values.date).format('YYYY-MM-DD');
  const oneTimeCost = data?.cost || 0;

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
    totalPrice: oneTimeCost,
    bookingType: 'One-time',
    isRecurring: false,
  });

  console.log(`One-time booking successful! Total: ₦${oneTimeCost.toLocaleString()}`);
}

await setDoc(doc(db, 'users', values.email), {
  email: values.email,
  name: values.name,
  phone: values.phone,
  subscribedAt: new Date().toISOString(),
},{merge:true});

await sendEmail(body);

  form.resetFields();
  setDataSubmit({} as BookingFormValues);
  setSelectedDays([]);
  setProceedPayment(false);
  toast.success(`${values.bookingType} booking successful for ${data?.title}`);
   console.log('Booking finished successfully. Navigating now...');


  
} catch (error) {
  console.error('Booking error:', error);
  message.error('Something went wrong. Please try again.');
} finally {
  setLoading(false);
  navigate('/');
}

};

  const publicKey = process.env.REACT_APP_Pay_PublicKey!;
 // const publicKey ='pk_test_0e745897d2bb51a12c4fca668a094dcecd425aea';

  const componentProp = {
  email: dataSubmit.email,
  amount: totalCost * 100,
  metadata: {
    custom_fields: [
      {
        display_name: "Full Name",
        variable_name: "name",
        value: dataSubmit.name
      },
      {
        display_name: "Phone Number",
        variable_name: "phone",
        value: dataSubmit.phone
      },
      {
        display_name: "Email Address",
        variable_name: "email",
        value: dataSubmit.email
      },
      {
        display_name: "Address",
        variable_name: "address",
        value: dataSubmit.address
      },
      {
        display_name: "Booking Type",
        variable_name: "bookingType",
        value: dataSubmit.bookingType
      },
      {
        display_name: "Service Booked",
        variable_name: "service",
        value: data?.title
      }
    ]
  },
  publicKey,
  text: `Pay now ₦${totalCost.toLocaleString()}`,
  onSuccess: () => {
    handleFinish();
  },
  onClose: () => {
    alert('You have closed the payment modal');
  }
};

  
  return (
    <>
      <Helmet>
        <title>Book Cleaning with TayCleaningServices</title>
        <meta name="description" content={`${data?.title}-Schedule a professional cleaning appointment with TayCleaningServices. Fast, easy, and reliable.`} />
      </Helmet>

      <BookingForm
    form={form}
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
    disabledTime={disabledTime}

    />
    </>
    
  );
};

export default BookingPage;
