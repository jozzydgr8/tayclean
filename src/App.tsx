import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./Pages/Home";
import BookingPage from "./Pages/BookingPage";
import { initializeApp } from "firebase/app";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import { UseDataContext } from "./Context/UseDataContext";
import { useEffect } from "react";
import { bookedDatesType, BookingFormValues } from "./Shared/Types";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9NLEL57jNz75w-_XCslWOeu3CjQXpd6Y",
  authDomain: "taycleaningservices-f09fd.firebaseapp.com",
  projectId: "taycleaningservices-f09fd",
  storageBucket: "taycleaningservices-f09fd.firebasestorage.app",
  messagingSenderId: "478605792466",
  appId: "1:478605792466:web:cdd707140caee05f66c90b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const bookinDateRef = collection(db, 'bookingDates');
export const bookingDataRef = collection(db, 'bookingData');


function App() {
  const {dispatch} = UseDataContext();
  //useEffect for booking dates 
  useEffect(() => {
  dispatch({ type: 'setloading', payload: true });
  const unSubscribe = onSnapshot(bookinDateRef, (snapshot) => {
    const data: bookedDatesType[] = snapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        date:docData.date
      };
    });

    dispatch({ type: 'getBookingDates', payload: data });
    console.log(data, 'bookedDates');
    dispatch({ type: 'setloading', payload: false });
  }, (error) => {
    console.error('Error fetching data:', error);
    dispatch({ type: 'setloading', payload: false });
  });

  return () => unSubscribe();
}, []);
  //useEffect fot booking data
    useEffect(() => {
    dispatch({ type: 'setloading', payload: true });
    const unSubscribe = onSnapshot(bookingDataRef, (snapshot) => {
      const data: BookingFormValues[] = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          name: docData.name,
          email: docData.email,
          date: docData.date
        };
      });

      dispatch({ type: 'getBookingData', payload: data });
      console.log(data, 'bookedData');
      dispatch({ type: 'setloading', payload: false });
    }, (error) => {
      console.error('Error fetching data:', error);
      dispatch({ type: 'setloading', payload: false });
    });

    return () => unSubscribe();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/tayclean" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path=":id" element={<BookingPage/> }/>

      </Route>
    )
  )
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
