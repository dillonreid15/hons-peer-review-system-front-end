import { AuthenticatedTemplate, useIsAuthenticated, useMsal } from "@azure/msal-react";
import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";
import { DetectIfStudent } from "../../azure/detectAuth";
import React from "react";

export function LecturerHome(){
    const isAuthenticated = useIsAuthenticated();
    const { accounts } = useMsal();
    const email = accounts[0] && accounts[0].username;
    const name = accounts[0] && accounts[0].name;
    const isStudent = DetectIfStudent();
    if(isAuthenticated){
        if(isStudent && email !== "DJYReid@dundee.ac.uk")
        {
            window.location.replace("/studenthome");
        }
    }
    else{
        window.location.replace("/");
    }
    return (
        <>
        <div className='signed-in-home-wrapper'>
        <AuthenticatedTemplate>
             
            <h1>Welcome lecturer { name } </h1>
            <SignOutButton/>
        </AuthenticatedTemplate>
        </div>
        </>
        );
}