import { Formik, Form, Field } from "formik"
import * as Yup from "yup";
import pooldetails from "../pooldata.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
    CognitoUserPool,
    CognitoUser
  } from "amazon-cognito-identity-js";

const Forgetpassword=()=>{

    const navigate = useNavigate();


const senEmail=(attrValues)=>{

    const userPool = new CognitoUserPool(pooldetails);

    const cognitoUser = new CognitoUser({ Username: attrValues.email, Pool: userPool });


    cognitoUser.forgotPassword({

        onSuccess:data=>{
        toast.success("Reset password verification code emailed successfully");
     
        },
        onFailure:data=>{
            toast.success("Error while sending reset password verification code");
        },
        inputVerificationCode:data=>{
            toast.success("Reset password verification code emailed successfully");
            navigate("/resetpassword");
            console.log("verification code data"+data);
        }

    });

    const email=attrValues.email;
    console.log("email is"+email);



}

//Reference taken from https://formik.org/


    return (
        <Formik
          initialValues={initialValues}
          validationSchema={validator}
          onSubmit={senEmail}
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
                <h3>Forget Password</h3>
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
      .email("Invalid Email Address")
  });
  
  const initialValues = {
    email: "",
  };
  
export default Forgetpassword;