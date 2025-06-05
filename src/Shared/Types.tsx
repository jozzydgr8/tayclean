import { Dayjs } from "dayjs"

export type bookedDatesType ={
    date:string

}
export interface BookingFormValues {
  name: string;
  email: string;
  date: Dayjs;
  address:string;
  phone:string;
  time:Dayjs;
  months:number,
  bookingType:string
}

export type recurringBookingFormValues = {
  title: string;
  name:string;
  email: string;
  sessionDates: Dayjs[];
  address:string;
  phone:string;
  months:number,
  bookingType:string,
  numberOfMonths:number,
  recurringCost:number,
  subscriptionStart:string,
  subscriptionEnd:string,
  totalCost:number,
  totalSessions:number,
  status:string,
}



export type MenuItem = {
    label: React.ReactNode; // `label` can be a string or any ReactNode (e.g., JSX, string)
    key: string; // key is required for each menu item
    icon: React.ReactNode;
    children?:{
      label:string,
      key:string,

    }[]
  }
  export type userProp={
    name:string,
    email:string,
    phone:string
  }