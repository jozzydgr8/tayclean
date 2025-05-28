import { Dayjs } from "dayjs"

export type bookedDatesType ={
    date:Dayjs

}
export interface BookingFormValues {
  name: string;
  email: string;
  date: Dayjs;
}