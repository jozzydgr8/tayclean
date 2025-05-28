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