import Helmet from 'react-helmet';
import React, { useEffect } from 'react'; 
import { SignInButton } from "../azure/SignInButton";
import { SignOutButton } from "../azure/SignOutButton";
import Navbar from "react-bootstrap/Navbar";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { UserData } from '../../azure/DetectAuth';


export function Login(){
    const User = UserData();
    useEffect(() => {
        if(User.isAuthenticated && User.IsUoD){window.location.replace('/redirect')}
    });
        return(
            <>
            <AuthenticatedTemplate>
            <div className="unauthorized-wrapper">
                <Helmet>
                    <title>Login</title>
                </Helmet>
                <div className="sign-in-wrapper">
                    <h1>Please Sign in with a valid @dundee.ac.uk email address to access this application</h1>
                    <Navbar bg="primary" variant="dark">
                        <SignOutButton/>
                    </Navbar>
                </div>
            </div>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
            <div className="unauthorized-wrapper">
                <Helmet>
                    <title>Login</title>
                </Helmet>
                <div className="sign-in-wrapper">
                    <h1>Please Sign in with a valid @dundee.ac.uk email address to access this application</h1>
                    <Navbar bg="primary" variant="dark">
                        <SignInButton/>
                    </Navbar>
                </div>
            </div>
            </UnauthenticatedTemplate>
            </>
        )
    // }
}
