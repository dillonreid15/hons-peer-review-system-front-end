import { AuthenticatedTemplate, useIsAuthenticated,  useMsal } from "@azure/msal-react";
import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";
import { DetectIfStudent } from "../../azure/detectAuth";
import React from "react";

export function StudentHome(){
    var isAuthenticated = useIsAuthenticated();
    var { accounts } = useMsal();
    var name = ""; 
    var isStudent = DetectIfStudent();
    if(isAuthenticated){
        console.log("yes");
        name = accounts[0] && accounts[0].name;
        if(!isStudent)
        {
            window.location.replace("/lecturehome");
        }
    }
    else{
        window.location.replace("/");
    }
    return (
        <>
        <div className='background-image-wrapper'>
            <div className='signed-in-home-wrapper'>
            <AuthenticatedTemplate>
                
                <h1>Welcome  student { name } </h1>
                <SignOutButton/>
            </AuthenticatedTemplate>
            </div>
        </div>
        </>
        );
}