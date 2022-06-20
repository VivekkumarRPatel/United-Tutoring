import "./Signup.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const onsubmit = (values) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validator}
      onSubmit={onsubmit}
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
                  type="number"
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
              <small  class="form-text text-muted">Register as a tutor or student or both.</small>
              <div class="form-group form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="option1"
                />
                <label class="form-check-label" for="inlineCheckbox1">
                  Tutor
                </label>
                <input
                  class="form-check-input ml-2"
                  type="checkbox"
                  value="option1"
                />
                <label class="form-check-label" for="inlineCheckbox1">
                  Student
                </label>
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
  firstname: Yup.string().required("First name is required"),

  lastname: Yup.string().required("Last name is required"),

  mobileno: Yup.number().required("Mobile no is required"),

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
});

const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  mobileno: "",
  password: "",
};

export default Signup;
