import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./Pages/Home";
import BookingPage from "./Pages/BookingPage";
import { initializeApp } from "firebase/app";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import { UseDataContext } from "./Context/UseDataContext";
import { useEffect } from "react";
import { bookedDatesType, BookingFormValues } from "./Shared/Types";
import dayjs from "dayjs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UseAuthContext } from "./Context/UseAuthContext";
import AdminLayout from "./Admin/AdminLayout";
import { Admin } from "./Admin/Admin";

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
export const bookingDateRef = collection(db, 'bookingDates');
export const bookingDataRef = collection(db, 'bookingData');
export const auth = getAuth();


function App() {
  const {user, dispatch:transmit, loading:userloading} = UseAuthContext();
  const {dispatch} = UseDataContext();
  //useeffect for auth

  //use efffeevt for user
  useEffect(()=>{
    transmit({type:'loading', payload:true});
    const unSubscribe = onAuthStateChanged(auth, user=>{
      if(user){
        transmit({type:'getUser', payload:user});
        console.log('signed in', user);
        transmit({type:'loading', payload:false});
      }else{
        transmit({type:'getUser', payload:null});
        console.log('logged out')
        transmit({type:'loading', payload:false});
      }
    });
    return ()=>unSubscribe()
  },[]);
console.log("Current user in component:", user);
  //useEffect for booking dates 
  useEffect(() => {
  dispatch({ type: 'setloading', payload: true });
  const unSubscribe = onSnapshot(bookingDateRef, (snapshot) => {
    const data: bookedDatesType[] = snapshot.docs.map((doc) => {
    const docData = doc.data();
    const rawDate = docData.date;

    return {
      id: doc.id,
      date: rawDate?.toDate // Firestore Timestamp to JS Date
        ? dayjs(rawDate.toDate()).format("YYYY-MM-DD")
        : rawDate, // fallback for already string values
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
          date: docData.date,
          address:docData.address,
          phone:docData.phone,
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
      <>
      <Route path="/tayclean" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path=":id" element={<BookingPage/> }/>

      </Route>
      <Route path="/admin" element= {<AdminLayout/>}>
      <Route index element={<Admin/>}/>

      </Route>
      </>



    )
  )
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
