import { useIsAuthenticated,  useMsal } from "@azure/msal-react";
import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";
import { DetectIfStudent } from "../../azure/detectAuth";
import React from "react";
import Helmet from 'react-helmet'; 
import { Usercheck } from "../../apiHandling/apiHandler";
import Button from "@restart/ui/esm/Button";
import { RedirectUser } from "../../azure/detectAuth";
import { UserData } from "../../azure/detectAuth";

export function StudentHome(){
    const User = UserData();
    console.log("here");
    if(User.isAuthenticated){
        console.log("yes");
        Usercheck();
        if(!User.IsStudent)
        {
            window.location.replace("/lecturehome");
        }
        else{
            return (
                <>
                <div className='background-image-wrapper'>
                    <div className='signed-in-home-wrapper'>
                    <Helmet>
                    <title>Welcome { User.name } </title>
                    </Helmet>
                        <h1>Welcome  student { User.name } </h1>
                        <SignOutButton/>
                    </div>
                </div>
                </>
                );
        }
    }
    else{
        window.location.replace("/");
    }
    
}