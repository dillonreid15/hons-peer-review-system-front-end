import Helmet from 'react-helmet'; 
import { SignInButton } from "../azure/SignInButton";
import { SignOutButton } from "../azure/SignOutButton";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import Button from '@restart/ui/esm/Button';

export function PageNotFound(){
    const isAuthenticated = useIsAuthenticated();
    return(
    <div className="unauthorized-wrapper">
        <Helmet>
            <title>Page Not Found</title>
        </Helmet>
        <div className="sign-in-wrapper">
            <h1>Page Not Found</h1>
            <Navbar bg="primary" variant="dark">
                <Button onClick={() => window.location.replace("/")}>Home</Button>
            </Navbar>
        </div>
    </div>
    )
}