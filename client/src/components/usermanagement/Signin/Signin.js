import "./Signin.css";
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

const Signin = () => {
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
        } else {
          toast.success(
            "User registered succesfully and account veification link send on the given email id.Please verify account before login"
          );
          navigate("/signin");
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
            <h3>Sign In</h3>
            <Form>
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
  email: Yup.string()
    .required("Email is required")
    .email("Invalid Email Address"),
password:Yup.string().required("password is required")
});

const initialValues = {
  email: "",
  password: "",
};

export default Signin;
