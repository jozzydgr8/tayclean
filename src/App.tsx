import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./Pages/Home";
import BookingPage from "./Pages/BookingPage";
import { initializeApp } from "firebase/app";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import { UseDataContext } from "./Context/UseDataContext";
import { useEffect } from "react";
import { bookedDatesType, BookingFormValues, recurringBookingFormValues, userProp } from "./Shared/Types";
import dayjs from "dayjs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UseAuthContext } from "./Context/UseAuthContext";
import AdminLayout from "./Admin/AdminLayout";
import { Admin } from "./Admin/Admin";
import Session from "./Pages/Session";
import { ProtectedRoutes } from "./Shared/ProtectedRoutes";
import { GuestRoutes } from "./Shared/GuestRoutes";
import { Loading } from "./Shared/Loading";
import { ToastContainer } from "react-toastify";
import UpdatePassword from "./Pages/UpdatePassword";

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
export const recurringSubscriptionsRef= collection(db, 'recurringSubscriptions');
export const userRef = collection(db, 'users');
export const auth = getAuth();


function App() {
  const {user, dispatch:transmit, loading:userloading} = UseAuthContext();
  const {dispatch, loading} = UseDataContext();

  //useEffect for animation
   useEffect(()=>{
    const animation = ()=>{
      var leftAnimate = document.querySelectorAll('.animate-left');
      var rightAnimate = document.querySelectorAll('.animate-right');
      var downAnimate = document.querySelectorAll('.animate-down');
      var upAnimate = document.querySelectorAll('.animate-up');

      var windowHeight = window.innerHeight;
      rightAnimate.forEach(container=>{
        var containerPosition = container.getBoundingClientRect().top;

        if(containerPosition < windowHeight){
          container.classList.add('sectionAnimationRight')
        }

      })
      leftAnimate.forEach(container=>{
        var containerPosition = container.getBoundingClientRect().top;

        if(containerPosition < windowHeight){
          container.classList.add('sectionAnimationLeft')
        }

      })
      upAnimate.forEach(container=>{
        var containerPosition = container.getBoundingClientRect().top;

        if(containerPosition < windowHeight){
          container.classList.add('sectionAnimationUp')
        }

      })
      downAnimate.forEach(container=>{
        var containerPosition = container.getBoundingClientRect().top;

        if(containerPosition < windowHeight){
          container.classList.add('sectionAnimationDown')
        }

      })
    }
    window.addEventListener('scroll', animation);
  },[])
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
      if(user?.uid !== process.env.REACT_APP_Accepted_Admin){
        return
      }
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
          time:docData.time,
          months:docData.months,
          bookingType:docData.bookingType,
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
  }, [user]);

  //useeffect to fetch recurring data
  useEffect(() => {
      if(user?.uid !== process.env.REACT_APP_Accepted_Admin){
        return
      }
    dispatch({ type: 'setloading', payload: true });
    const unSubscribe = onSnapshot(recurringSubscriptionsRef, (snapshot) => {
      const data: recurringBookingFormValues[] = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          name:docData.name,
          title: docData.title,
          email: docData.email,
          sessionDates: docData.sessionDates,
          address:docData.address,
          phone:docData.phone,
          time:docData.time,
          months:docData.months,
          bookingType:docData.bookingType,
          numberOfMonths:docData.numberOfMonths,
          recurringCost:docData.recurringCost,
          subscriptionStart:docData.subscriptionStart,
          subscriptionEnd:docData.subscriptionEnd,
          totalCost:docData.totalCost,
          totalSessions:docData.totalSessions,
          status:docData.status,
          
        };
      });

      dispatch({ type: 'getRecurringBookingData', payload: data });
      console.log(data, 'bookedData');
      dispatch({ type: 'setloading', payload: false });
    }, (error) => {
      console.error('Error fetching data:', error);
      dispatch({ type: 'setloading', payload: false });
    });

    return () => unSubscribe();
  }, [user]);

  //use effect to fetch users
  useEffect(() => {
    if(user?.uid !== process.env.REACT_APP_Accepted_Admin){
        return
      }
    dispatch({ type: 'setloading', payload: true });
    const unSubscribe = onSnapshot(userRef, (snapshot) => {
      const data: userProp[] = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          name: docData.name,
          email: docData.email,
          phone:docData.phone
         
        };
      });

      dispatch({ type: 'getUserData', payload: data });
      console.log(data, 'userData');
      dispatch({ type: 'setloading', payload: false });
    }, (error) => {
      console.error('Error fetching data:', error);
      dispatch({ type: 'setloading', payload: false });
    });

    return () => unSubscribe();
  }, [user]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path=":id" element={<BookingPage/> }/>

      </Route>
      <Route path="/admin_832984" element= {<AdminLayout/>}>
      <Route index element={<ProtectedRoutes user={user}><Admin/></ProtectedRoutes>}/>
      <Route path="session" element= {<GuestRoutes user={user}><Session/></GuestRoutes>}/>
      <Route path="settings" element={<Outlet/>}>
      <Route path="updatepassword" element={<UpdatePassword/>}/>

      </Route>

      </Route>
      </>



    )
  )
  if(userloading || loading){
    return <Loading/>
  }
  return (
    <div className="App">
      <RouterProvider router={router}/>
       <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light" // or "dark"
    />
    </div>
  );
}

export default App;
