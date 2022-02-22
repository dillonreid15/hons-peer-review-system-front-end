import Helmet from 'react-helmet'; 
import { SignInButton } from "../azure/SignInButton";
import { SignOutButton } from "../azure/SignOutButton";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import { DetectIfStudent, DetectIfUod, RedirectUser } from "../../azure/detectAuth";

export function UnauthorizedComponent(){
    const isAuthenticated = useIsAuthenticated();
    return(
    <div className="unauthorized-wrapper">
        <Helmet>
            <title>Unregistered User</title>
        </Helmet>
        <div className="sign-in-wrapper">
            <h1>Please Sign in with a valid @dundee.ac.uk email address to access this application</h1>
            <Navbar bg="primary" variant="dark">
                { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
            </Navbar>
        </div>
    </div>
    )
}

export function AuthorizedComponent(){
    const isUoD = DetectIfUod();
    if(isUoD){
        RedirectUser();
    } 
    return(
        <UnauthorizedComponent/>
    )
}