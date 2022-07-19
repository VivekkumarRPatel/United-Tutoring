import "./Signup.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import pooldetails from "../pooldata.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const Signup = () => {
  //Initialize instance with AWS cognito user pool data
  const userPool = new CognitoUserPool(pooldetails);
  //   AWS.config.update({
  //     region: 'us-east-1'
  // });
  const navigate = useNavigate();

  const onsubmit = (values) => {
    console.log(values);
  };

  const registerUser = (attributeValues) => {
    console.log(attributeValues.usertype.toString());

    const attributeList = [
      new CognitoUserAttribute({
        Name: "family_name",
        Value: attributeValues.lastname,
      }),
      new CognitoUserAttribute({
        Name: "given_name",
        Value: attributeValues.firstname,
      }),
      new CognitoUserAttribute({
        Name: "email",
        Value: attributeValues.email,
      }),
      new CognitoUserAttribute({
        Name: "phone_number",
        Value: attributeValues.mobileno,
      }),
      new CognitoUserAttribute({
        Name: "custom:user_type",
        Value: attributeValues.usertype.toString(),
      }),
    ];

    userPool.signUp(
      attributeValues.email,
      attributeValues.password,
      attributeList,
      null,


      function (err, result) {

        if (err) {
          toast.error(err.message);
        }
        else{
        const api = 'https://8z9upjgji0.execute-api.us-east-1.amazonaws.com/dev/save-user-details';
        const data = {
          "register" : true,
          "userType" : attributeValues.usertype.toString(),
          "email" :  attributeValues.email,
          "firstName" : attributeValues.firstname,
          "lastName" : attributeValues.lastname,
          "mobileNo" : attributeValues.mobileno
        };
        axios
          .post(api, data)
          .then((response) => {
            console.log("res:"+response);
            
          })
          .catch((error) => {
            console.log(error);
          });
          const userDetails=result.user;
          localStorage.setItem('username', userDetails.username);

          toast.success(
            "User registered succesfully and account veification link send on the given email id.Please verify account before login"
          );

          navigate("/verifyaccount");
        }
      }

    );
    
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validator}
      onSubmit={registerUser}
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
            <h3>Sign Up</h3>
            <Form>
              <div className="form-group ">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter First Name"
                  name="firstname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstname}
                />
                {errors.firstname && touched.firstname ? (
                  <small className="error">{errors.firstname}</small>
                ) : null}
              </div>
              <div className="form-group ">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Last Name"
                  name="lastname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastname}
                />
                {errors.lastname && touched.lastname ? (
                  <small className="error">{errors.lastname}</small>
                ) : null}
              </div>
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
              <div className="form-group ">
                <label>Mobile No</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Mobile No"
                  name="mobileno"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mobileno}
                />
                {errors.mobileno && touched.mobileno ? (
                  <small className="error">{errors.mobileno}</small>
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
                Register as a tutor or student or both.
              </small>
              <div className="form-group form-check form-check-inline">
                {/* <input
                  className="form-check-input"
                  type="checkbox"
                  value="tutor"
                  name="checked"
                /> */}
                <Field type="checkbox" name="usertype" value="tutor" />
                <label className="form-check-label ml-1" for="inlineCheckbox1">
                  Tutor
                </label>
                {/* <input
                  className="form-check-input ml-2"
                  type="checkbox"
                  value="student"
                  name="checked"
                /> */}
                <Field
                  type="checkbox"
                  name="usertype"
                  value="student"
                  className="ml-2"
                />
                <label className="form-check-label ml-1" for="inlineCheckbox1">
                  Student
                </label>
              </div>
              {errors.usertype && touched.usertype ? (
                <small className="error">{errors.usertype}</small>
              ) : null}

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
  firstname: Yup.string().required("First name is required"),

  lastname: Yup.string().required("Last name is required"),

  mobileno: Yup.string().required("Mobile no is required"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password length should be 8 chars minimum")
    .max(12, "Password length is 12 chars maximum")
    .matches(
      /^(?=.*\d)(?=.+[&!$%@?#])[A-Za-z\d!*$%@?&#]{8,12}$/,
      "Password should contains at least one number and special character"
    ),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid Email Address"),

  usertype: Yup.array().min(1).of(Yup.string().required()),
});

const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  mobileno: "",
  password: "",
  usertype: [],
};

export default Signup;
