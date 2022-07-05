import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import Signup from './components/usermanagement/Signup/Signup';
import Signin from './components/usermanagement/Signin/Signin';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from './components/Footer/Footer';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

function App() {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Header />
        <div className="container">

          <Routes >
            <Route path='/' element={<AuthenticatedRoute />}>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/tutor" element={<Tutor />}></Route>
              <Route path="/student" element={<Student />}></Route>
              <Route path="/profile" element={<Profile />}></Route>

            </Route>
          </Routes>

          <Routes>
            <Route path='/' element={<UnAuthenticatedRoute restrictedToPublicOnly={true} />} >
              <Route path="/" element={<Signin />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/signin" element={<Signin />}></Route>
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
