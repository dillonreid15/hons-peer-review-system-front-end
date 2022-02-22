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

export function LecturerHome(){
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    const name = accounts[0] && accounts[0].name;

    const isUoD = DetectIfUod();
    const isStudent = DetectIfStudent();
    // if(!isUoD){
    //     return(
    //         <div className='home-wrapper'>
    //         <AuthenticatedTemplate>
    //             <UnauthorizedComponent/>
    //         </AuthenticatedTemplate>
    //         <UnauthenticatedTemplate>
    //             <UnauthorizedComponent/>
    //         </UnauthenticatedTemplate>
    //         </div>
    //     );
    // }
    return (
        <>
        <div className='home-wrapper'>
        <AuthenticatedTemplate>
             
            <h1>Welcome lecture { name } </h1>
            <SignOutButton/>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
            <UnauthorizedComponent/>
        </UnauthenticatedTemplate>
        </div>
        </>
        );
}