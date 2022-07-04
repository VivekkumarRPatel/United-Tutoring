import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {
    CognitoUserPool,
    AmazonCognitoIdentity
} from "amazon-cognito-identity-js";
import pooldetails from "../usermanagement/pooldata.json";

const AuthenticatedRoute = () => {

    const [isUserValid, setValidUser] = React.useState(true);
    //Initialize instance with AWS cognito user pool data
    const userPool = new CognitoUserPool(pooldetails);

    //var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    useEffect(() => {
        console.log("Inside Authenticated route");
        (async () => {
            let loggedInUser = null;

            try {
                loggedInUser = await userPool.getCurrentUser();
                console.log("Inside Authenticated route user data" + loggedInUser);
                // console.log("Authenticated" + loggedInUser.getUserData());

                if (loggedInUser) {
                    setValidUser(true);
                } else {
                    setValidUser(false)
                }
            } catch (e) {
                setValidUser(false);
            }
        })();
    }, [])

    console.log("Inside Authenticated route: " + isUserValid);
    return (

        isUserValid ? <Outlet /> : <Navigate to="/signin" />
    );
};

export default AuthenticatedRoute;