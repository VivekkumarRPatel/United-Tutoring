import { Formik, Form, Field } from "formik";
import "./Verifyaccount.css";
import * as Yup from "yup";
import pooldetails from "../pooldata.json";
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
} from "amazon-cognito-identity-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AWS from 'aws-sdk';
import axios from 'axios';
//import * as AWS from "@aws-sdk/client-sns";

// const SESConfig = {
//     apiVersion: "2010-12-01",
//     accessKeyId: "AKIA4RE7FY6PYYZZQ6VQ",
//     accessSecretKey:"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",
//     region: "us-east-1"
// }

// AWS.config.update(SESConfig);


const SESConfig = {
    apiVersion: "2010-12-01",
    accessKeyId: "AKIA4RE7FY6PYYZZQ6VQ",
    accessSecretKey: "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",
    
}

const snsClient = new AWS.SNS({region: "us-east-1"});

const Verifyaccount = () => {

    const navigate = useNavigate();

    const username = localStorage.getItem('username');

    const validator = Yup.object().shape({
        email: Yup.string()
            .required("Email is required")
            .email("Invalid Email Address"),
        code: Yup.string().required("Verification code is required")
    });

    const initialValues = {
        email: username,
        code: "",
    };

    const verifyCode = (attributeValues) => {

        console.log(attributeValues);

        //Initialize instance with AWS cognito user pool data
        const userPool = new CognitoUserPool(pooldetails);
        const cognitoUser = new CognitoUser({ Username: attributeValues.email, Pool: userPool });
        cognitoUser.confirmRegistration(
            attributeValues.code,
            true,
            function (err, result) {
                if (result == "SUCCESS") {


                const api = 'https://5f0musvxee.execute-api.us-east-1.amazonaws.com/dev/subscribe?id='+username;
                    
                    axios
                    .get(api, {
                        headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        crossDomain: true
                    })
                    .then((response) => {
                        console.log("res:"+response);
                        navigate("/signin");
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                   
                } else {
                    const erroMessage = err.message;
                    toast.error(
                        erroMessage
                    );
                }
            }
        );
    }


    function resendCode(e) {
        e.preventDefault();
        console.log("inside resend code");
        const userPool = new CognitoUserPool(pooldetails);
        const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });

        cognitoUser.resendConfirmationCode(function (err, result) {
            console.log(err);
            console.log(result);
            if (result == "SUCCESS") {
                const successMessage = result.message;
                toast.success("Verification code resend successfully");
            } else {
                const errMessage = err.message;
                toast.error("Error while sending verification code");
            }

        });

    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validator}
            onSubmit={verifyCode}
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
                        <h3>Verify Account</h3>
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
                                    type="text"
                                    className="form-control"
                                    placeholder="Verification Code"
                                    name="code"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.code}
                                />
                                {errors.code && touched.code ? (
                                    <small className="error">{errors.code}</small>
                                ) : null}
                            </div>
                            <small><a href="#" onClick={resendCode}>Resend verification code</a></small>
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

}


const validator = Yup.object().shape({
    email: Yup.string()
        .required("Email is required")
        .email("Invalid Email Address"),
    code: Yup.string().required("password is required")
});

const initialValues = {
    email: "",
    code: "",
};

export default Verifyaccount;



// onClick={event => {formik.resetForm({
//     values: {
//         email: username,
//         code: ''
//     }
// }); resendCode(); }}