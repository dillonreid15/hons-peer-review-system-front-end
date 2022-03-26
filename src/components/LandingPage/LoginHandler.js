import Helmet from 'react-helmet';
import React, { useEffect } from 'react'; 
import { SignInButton } from "../azure/SignInButton";
import { SignOutButton } from "../azure/SignOutButton";
import Navbar from "react-bootstrap/Navbar";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { UserData } from '../../azure/detectAuth';
import './Home.css'
import Popup from "react-popup";

export function Login(){
    const User = UserData();

    useEffect(() => {
        //If user is signed in, redirect
        if(User.isAuthenticated && User.IsUoD){
            window.location.replace('/redirect')
        }
        Popup.alert("This site uses localStorage, please ensure cookies are enabled");
        // eslint-disable-next-line
    });
    
        return(
            <>
            {/* Authenticated template only renders if a user is successfully logged in, however, if the user is
            not from the University of Dundee, this will render and request that they log in with a @dundee.ac.uk email */}
            <AuthenticatedTemplate>
            <div className="unauthorized-wrapper">
                <Helmet>
                    <title>Login</title>
                </Helmet>
                <div className="sign-in-wrapper" >
                    <h3>Please Sign in with a valid @dundee.ac.uk email address</h3>
                    <Navbar bg="primary" variant="dark">
                        <SignOutButton/>
                    </Navbar>
                </div>
            </div>
            </AuthenticatedTemplate>
            {/* Render only if no user is logged in */}
            <UnauthenticatedTemplate>
            <div className="unauthorized-wrapper">
                <Helmet>
                    <title>Login</title>
                </Helmet>
                <div className="sign-in-wrapper">
                    <h1>Please Sign in with a valid @dundee.ac.uk email address</h1>
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
