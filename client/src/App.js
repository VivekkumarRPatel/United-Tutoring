import './App.css';
import "react-toastify/dist/ReactToastify.css";


import Header from './components/Header/Header';
import Signup from './components/usermanagement/Signup/Signup';
import Signin from './components/usermanagement/Signin/Signin';
import Footer from './components/Footer/Footer';
import Verifyaccount from './components/usermanagement/Verifyaccount/Verifyaccount';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/home';
import AuthenticatedRoute from './components/Authenticator/AuthenticatedRoute';
import UnAuthenticatedRoute from './components/Authenticator/UnAuthenticatedRoute';
import Tutor from './components/Tutor/Tutor';
import Student from './components/Student/Student';
import Forgetpassword from './components/usermanagement/Forgetpassword/Forgetpassword';
import Resetpassword from './components/usermanagement/Resetpassword/Resetpassword';
import Profile from './components/Profile/Profile';
import Availability from './components/Tutor/Availability'


import { useEffect, useState } from 'react';
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookingDetails from './components/Tutor/BookingDetails';


function App() {

  const [auth,setAuth] = useState({
      isAuthenticated : false,
      user: {
        userType:''
      }
    })

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Header auth = {auth} setAuth = {setAuth} />
        <div className="container">

          <Routes >
            <Route path='/' element={<AuthenticatedRoute />}>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/tutor" element={<Tutor auth = {auth} setAuth = {setAuth} />}></Route>
              <Route path="/student" element={<Student auth = {auth} setAuth = {setAuth} />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/tutor/availability" element={<Availability auth = {auth} setAuth = {setAuth} />} />
              <Route path="/tutor/bookings" element={<BookingDetails auth = {auth} setAuth = {setAuth} />} />
            </Route>
          </Routes>

          <Routes>
            <Route path='/' element={<UnAuthenticatedRoute restrictedToPublicOnly={true} />} >
              <Route path="/" element={<Dashboard />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/signin"  element={<Signin auth = {auth} setAuth = {setAuth} />}></Route>
              <Route path="/verifyaccount" element={<Verifyaccount />}></Route>
              <Route path="/forgetpassword" element={<Forgetpassword />}></Route>
              <Route path="/resetpassword" element={<Resetpassword />}></Route>
            </Route>
          </Routes>

        </div>
        <Footer />
      </BrowserRouter>


    </div>
  );
}

export default App;
