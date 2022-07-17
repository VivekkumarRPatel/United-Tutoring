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
        (async () => {
            let loggedInUser = null;

            try {
                loggedInUser = await userPool.getCurrentUser();
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

    return (

        isUserValid ? <Outlet /> : <Navigate to="/signin" />
    );
};

export default AuthenticatedRoute;