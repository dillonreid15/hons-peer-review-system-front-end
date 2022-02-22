import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, MsalProvider, useMsal } from "@azure/msal-react";
import { UnauthorizedComponent } from "./UnauthorizedComponent";
import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";
import { loginRequest } from "../../azure/authConfig";
import Button from "react-bootstrap/Button";
import { ProfileData } from "../azure/ProfileData";
import { callMsGraph } from "../../azure/graph";
import { DetectIfStudent, DetectIfUod } from "../../azure/detectAuth";
import React, { useState } from "react";

export function StudentHome(){
    const isAuthenticated = useIsAuthenticated();
    if(isAuthenticated){
    const isUoD = DetectIfUod();
    const isStudent = DetectIfStudent();
    }
    else{
        window.location.replace("/");
    }
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    const name = accounts[0] && accounts[0].name;

    return (
        <>
        <div className='home-wrapper'>
        <AuthenticatedTemplate>
             
            <h1>Welcome  student { name } </h1>
            <SignOutButton/>
        </AuthenticatedTemplate>
        </div>
        </>
        );
}