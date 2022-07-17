import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {
    CognitoUserPool,
    AmazonCognitoIdentity
} from "amazon-cognito-identity-js";
import pooldetails from "../usermanagement/pooldata.json";

const UnAuthenticatedRoute = ({ restrictedToPublicOnly }) => {

    const [isUserValid, setValidUser] = React.useState(false);
    const userPool = new CognitoUserPool(pooldetails);
    //var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    useEffect(() => {
        (async () => {
            let loggedInUser = null;

            try {
                loggedInUser = await userPool.getCurrentUser();

                if (loggedInUser) {
                    setValidUser(true);
                }
            } catch (e) {
                setValidUser(false);
            }
        })();
    })

    return (
        !isUserValid ?  <Outlet /> : <Navigate to="/tutor" />
    );
};

export default UnAuthenticatedRoute;