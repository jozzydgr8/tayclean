import React, { createContext, useReducer } from "react";
import { bookedDatesType, BookingFormValues } from "../Shared/Types";


// Types


type State = {
  bookedDates: bookedDatesType[] | null;
  loading: boolean;
  bookingData:BookingFormValues[] | null;
};


type LoadAction = {
  type: "setloading";
  payload: boolean;
};

type bookingDataAction = {
  type:'getBookingData',
  payload: BookingFormValues[] | null
}
type bookingDatesAction = {
  type:'getBookingDates',
  payload: bookedDatesType[] | null
}
type Action = LoadAction | bookingDataAction | bookingDatesAction;

type ContextProps = State & {
  dispatch: React.Dispatch<Action>;
};

type ComponentProps = {
  children: React.ReactNode;
};

// Initial State
const initialState: State = {
  bookedDates: null,
  loading: false,
  bookingData:null,

};

// Create Context with default value
export const Context = createContext<ContextProps>({
  ...initialState,
  dispatch: () => null, // dummy dispatch for default
});

// Reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setloading":
      return { ...state, loading: action.payload };
    case "getBookingData":
      return {...state, bookingData: action.payload};
    case "getBookingDates":
       return { ...state, bookedDates: action.payload };
    default:
      return state;
  }
};

// Provider
export const ContextData = ({ children }: ComponentProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  );
};