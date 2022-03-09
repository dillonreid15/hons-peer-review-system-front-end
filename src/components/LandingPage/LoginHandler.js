import Helmet from 'react-helmet'; 
import { SignInButton } from "../azure/SignInButton";
import { SignOutButton } from "../azure/SignOutButton";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import { DetectIfUod, RedirectUser, RedirectUserLogin } from "../../azure/detectAuth";
import { useMsal } from '@azure/msal-react';
import { render } from '@testing-library/react';
import { UserData } from '../../azure/detectAuth';

export function Login(){
    const User = UserData();
    if(User.isAuthenticated){
        window.location.replace("/");
    }    
    return(
    <div className="unauthorized-wrapper">
        <Helmet>
            <title>Login</title>
        </Helmet>
        <div className="sign-in-wrapper">
            <h1>Please Sign in with a valid @dundee.ac.uk email address to access this application</h1>
            <Navbar bg="primary" variant="dark">
                { User.isAuthenticated ? <SignOutButton /> : <SignInButton /> }
            </Navbar>
        </div>
    </div>
    )
}

// export function AuthorizedComponent(){
//     const isUoD = DetectIfUod();
//     const { accounts } = useMsal();
//     const name = accounts[0] && accounts[0].name;
//     console.log(name);
//     if(isUoD){
//         RedirectUser();
//         return(<h1>Loading...</h1>)
//     }
//     else{ 
//     return(
//         <Login/>
//     )
//     }
// }