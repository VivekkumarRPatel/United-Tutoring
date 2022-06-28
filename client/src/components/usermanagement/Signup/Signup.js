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
          //   if (err.code === "UsernameExistsException") {
          //     //errPayload.message = "User exists. Please try to Login.";
          //     toast.error(
          //     err.message
          //     );
          //   } else if (err.code === "InvalidParameterException") {
          //     // errPayload.message =
          //     //   "Add country code to phone number. Example: +1 for Canada";
          //     toast.error(
          //       "Add country code to phone number. Example: +1 for Canada"
          //     );
          //   } else if (err.code === "InvalidPasswordException") {
          //     //     errPayload.message =
          //     //       "Password did not match requirement. Please check password criteria and try again.";
          //     toast.error(
          //       "Password did not match requirement. Please check password criteria and try again."
          //     );
          //   }
        }
        else{

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
          <div class="signup-container">
            <h3>Sign Up</h3>
            <Form>
              <div class="form-group ">
                <label>First Name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter First Name"
                  name="firstname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstname}
                />
                {errors.firstname && touched.firstname ? (
                  <small class="error">{errors.firstname}</small>
                ) : null}
              </div>
              <div class="form-group ">
                <label>Last Name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter Last Name"
                  name="lastname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastname}
                />
                {errors.lastname && touched.lastname ? (
                  <small class="error">{errors.lastname}</small>
                ) : null}
              </div>
              <div class="form-group ">
                <label for="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  name="email"
                  placeholder="Enter email address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {errors.email && touched.email ? (
                  <small class="error">{errors.email}</small>
                ) : null}
              </div>
              <div class="form-group ">
                <label>Mobile No</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter Mobile No"
                  name="mobileno"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mobileno}
                />
                {errors.mobileno && touched.mobileno ? (
                  <small class="error">{errors.mobileno}</small>
                ) : null}
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && touched.password ? (
                  <small class="error">{errors.password}</small>
                ) : null}
              </div>
              <small class="form-text text-muted">
                Register as a tutor or student or both.
              </small>
              <div class="form-group form-check form-check-inline">
                {/* <input
                  class="form-check-input"
                  type="checkbox"
                  value="tutor"
                  name="checked"
                /> */}
                <Field type="checkbox" name="usertype" value="tutor" />
                <label class="form-check-label ml-1" for="inlineCheckbox1">
                  Tutor
                </label>
                {/* <input
                  class="form-check-input ml-2"
                  type="checkbox"
                  value="student"
                  name="checked"
                /> */}
                <Field
                  type="checkbox"
                  name="usertype"
                  value="student"
                  class="ml-2"
                />
                <label class="form-check-label ml-1" for="inlineCheckbox1">
                  Student
                </label>
              </div>
              {errors.usertype && touched.usertype ? (
                <small class="error">{errors.usertype}</small>
              ) : null}

              <center>
                <button
                  type="submit"
                  class="btn btn-primary"
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
