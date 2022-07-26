import "./Signin.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";
import pooldetails from "../pooldata.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";




const Signin = ( props ) => {
  //   AWS.config.update({
  //     region: 'us-east-1'
  // });
  const navigate = useNavigate();
  const Auth = props.Auth;
  const setAuth = props.setAuth;

  const authenticateUser = (attributeValues) => {

    console.log(attributeValues.email);

//Reference taken from https://iwconnect.com/cognito-user-pool-sign-register-sign-up-user-process/

    //Initialize instance with AWS cognito user pool data
    const userPool = new CognitoUserPool(pooldetails);

    const cognitoUser = new CognitoUser({ Username: attributeValues.email, Pool: userPool });

    //Set credential user has entered in AWS authentication details object
    const authenticationDetails = new AuthenticationDetails({
      Username: attributeValues.email,
      Password: attributeValues.password,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        //get user type
        var userType = result.idToken.payload["custom:user_type"];
        localStorage.setItem('userType',userType);
        if(userType.indexOf(',')!=-1){
          localStorage.setItem('tutor', "tutor");
          localStorage.setItem('student', "student");
        }else{

          if(userType==="tutor"){
            localStorage.setItem('tutor', "tutor");
          }else{
            localStorage.setItem('student', "student");
          }
        }
        var email = result.idToken.payload.email;
        console.log("value of the token is" + result.getIdToken().getJwtToken());
        localStorage.setItem('token', result.getIdToken().getJwtToken());
        localStorage.setItem('username', result.idToken.payload.email);
        localStorage.setItem('firstnameCloud', result.idToken.payload.given_name);
        localStorage.setItem('lastnameCloud', result.idToken.payload.family_name);
        localStorage.setItem('mobilenoCloud', result.idToken.payload.phone_number);
        toast.success(
          "User logged in succesfully."
        );
      //  window.location.href = '/dashboard';
      if( localStorage.getItem('tutor') ==="tutor" && localStorage.getItem('student') ==="student"  ){
        //navigate("/tutor");
        window.location.href = '/tutor';
      }else if(localStorage.getItem('tutor') ==="tutor"){
        //navigate("/tutor");
        window.location.href = '/tutor';
      }else if(localStorage.getItem('student') ==="student"){
        //navigate("/student");
        window.location.href = '/student';
      }

        // console.log('access token + ' + result.getAccessToken().getJwtToken());
        // console.log('id token + ' + result.getIdToken().getJwtToken());
        // console.log('refresh token + ' + result.getRefreshToken().getToken());
        // response.send("success");
      },
      onFailure: function (err) {
        toast.error(err.message);
      }
    })



  };


  //Reference taken from https://formik.org/
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validator}
      onSubmit={authenticateUser}
    >
      {(formik) => {
        const {
          values,
          errors,
          touched,
          isValid,
          dirty,
          handleChange,
          handleSubmit,
          handleBlur,
        } = formik;

        return (
          /**
           * This code is refered from
           * https://getbootstrap.com/docs/4.1/components/forms/
           * https://getbootstrap.com/docs/4.6/components/forms/#server-side
           *
           */
          <div className="signup-container">
            <h3>Sign In</h3>
            <Form>
              <div className="form-group ">
                <label for="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {errors.email && touched.email ? (
                  <small className="error">{errors.email}</small>
                ) : null}
              </div>

              <div className="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && touched.password ? (
                  <small className="error">{errors.password}</small>
                ) : null}
              </div>
              
              <small className="form-text text-muted">
              <a href="/forgetpassword">  Forget password.</a>
              </small>
              
              <center>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!(dirty && isValid)}
                >
                  Submit
                </button>
              </center>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

const validator = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid Email Address"),
  password: Yup.string().required("password is required")
});

const initialValues = {
  email: "",
  password: "",
};

export default Signin;
