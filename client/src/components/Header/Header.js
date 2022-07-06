import pooldetails from "../usermanagement/pooldata.json";
import {
  CognitoUserPool,
  CognitoUser,
  AmazonCognitoIdentity
} from "amazon-cognito-identity-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const Header = () => {
  const api = 'https://b30b41k856.execute-api.us-east-1.amazonaws.com/dev/get-profile-img?id='+localStorage.getItem('username');
  axios
  .get(api, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    crossDomain: true
  })
  .then((response) => {
    console.log("res:"+response.data);
    localStorage.setItem('profile-img',response.data);
    
  })
  .catch((error) => {
    console.log(error);
  });
  const navigate = useNavigate();

  const signout = () => {
    console.log("inside signout");

    const userPool = new CognitoUserPool(pooldetails);


    var userDetails = {
      Username: localStorage.getItem('username'),
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userDetails);

    cognitoUser.signOut();
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    if (localStorage.getItem('tutor')) {
      localStorage.removeItem('tutor');
    }
    if (localStorage.getItem('student')) {
      localStorage.removeItem('student');
    }
    toast.success("User signout successfully");
    navigate("/signin");
  }



  return (
    /**
     * This code is refered from
     * https://getbootstrap.com/docs/4.0/getting-started/introduction/
     */
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#headermenu"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="headermenu">
        {console.log(localStorage.getItem('token'))}
        {localStorage.getItem('token') == null ? <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/signup">
              Signup
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/signin">
              Login
            </a>
          </li>
        </ul> : null}


        {localStorage.getItem('token') !== null ? <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <img
              style={{
                alignSelf: 'center',
                height: 100,
                width: 100,
                borderWidth: 1,
                borderRadius: 75
              }}
                alt=""
                src={localStorage.getItem('profile-img')}
              />
            </a>
            <div
              class="dropdown-menu dropdown-menu-md-right"
              aria-labelledby="navbarDropdown"
            >
              <a class="dropdown-item" href="/profile">
                Profile
              </a>
              <a onClick={signout} class="dropdown-item">
                Logout
              </a>
            </div>
          </li>
        </ul>
          : null}

        {localStorage.getItem('tutor') !== null ? <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/tutor">
              Tutor
            </a>
          </li>
        </ul> : null}

        {localStorage.getItem('student') !== null ? <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/student">
              Student
            </a>
          </li>
        </ul> : null}



      </div>
    </nav>
  );
};

export default Header;
