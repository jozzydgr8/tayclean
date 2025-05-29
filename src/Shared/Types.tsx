import { Dayjs } from "dayjs"

export type bookedDatesType ={
    date:string

}
export interface BookingFormValues {
  name: string;
  email: string;
  date: Dayjs;
  address:string;
  phone:string
}


export type MenuItem = {
    label: React.ReactNode; // `label` can be a string or any ReactNode (e.g., JSX, string)
    key: string; // key is required for each menu item
    icon: React.ReactNode
  };