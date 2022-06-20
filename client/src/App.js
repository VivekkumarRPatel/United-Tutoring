import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import Signup from './components/usermanagement/Signup/Signup';
import Signin from './components/usermanagement/Signin/Signin';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Signup />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
          </Routes>
        </div>
        <Footer/>
      </BrowserRouter>

    </div>
  );
}

export default App;
