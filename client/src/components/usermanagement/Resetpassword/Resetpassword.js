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


const Resetpassword = () => {


    const navigate = useNavigate();


    const changePassword = (attrValues) => {


        const userPool = new CognitoUserPool(pooldetails);

        const cognitoUser = new CognitoUser({ Username: attrValues.email, Pool: userPool });

        cognitoUser.confirmPassword(attrValues.code,attrValues.newpassword,
            {
                onSuccess: data => {
                    toast.success("Password updated successfully");
                    navigate("/signin");

                },
                onFailure: data => {
                    toast.success("Error while updating password");
                }
            }
        );

    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validator}
            onSubmit={changePassword}
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
                        <h3>Reset Password</h3>
                        <Form>
                            <div className="form-group ">
                                <label >Verification Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="code"
                                    placeholder="Please enter verification code"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.code}
                                />
                                {errors.code && touched.code ? (
                                    <small className="error">{errors.code}</small>
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
                                <label >Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="newpassword"
                                    placeholder="Please enter new password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.newpassword}
                                />
                                {errors.newpassword && touched.newpassword ? (
                                    <small className="error">{errors.newpassword}</small>
                                ) : null}
                            </div>

                            <center>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!(dirty && isValid)}
                                >
                                    Change Password
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
    code: Yup.string().required("verification code is required"),
    email: Yup.string()
        .required("Email is required")
        .email("Invalid Email Address"),
    newpassword: Yup.string()
        .required("Password is required")
        .min(8, "Password length should be 8 chars minimum")
        .max(12, "Password length is 12 chars maximum")
        .matches(
            /^(?=.*\d)(?=.+[&!$%@?#])[A-Za-z\d!*$%@?&#]{8,12}$/,
            "Password should contains at least one number and special character"
        ),
});

const initialValues = {
    code: "",
    email: "",
    newpassword: ""
};


export default Resetpassword;