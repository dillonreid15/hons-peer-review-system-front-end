import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, MsalProvider, useMsal } from "@azure/msal-react";
import { AuthorizedComponent,UnauthorizedComponent } from "./UnauthorizedComponent";
import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";
import { loginRequest } from "../../azure/authConfig";
import Button from "react-bootstrap/Button";
import { ProfileData } from "../azure/ProfileData";
import { callMsGraph } from "../../azure/graph";
import { DetectIfStudent, DetectIfUod, RedirectUser } from "../../azure/detectAuth";
import React, { useState } from "react";



export function Home(){
    // const { instance, accounts } = useMsal();
    // const [graphData, setGraphData] = useState(null);
    // // const name = accounts[0] && accounts[0].name;
    // // const isUod = DetectIfUod();
    
    return (
        <>
        <div className='home-wrapper'>
        <AuthenticatedTemplate>
            <AuthorizedComponent/>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
            <UnauthorizedComponent/>
        </UnauthenticatedTemplate>
        </div>
        </>
        );
}


  