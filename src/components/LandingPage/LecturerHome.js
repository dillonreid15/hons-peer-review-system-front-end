import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";
import { UserData } from "../../azure/detectAuth";
import React from "react";
import Helmet from 'react-helmet'; 
import { Usercheck } from "../../apiHandling/apiHandler";


export function LecturerHome(){
    const User = UserData();
    // const isAuthenticated = useIsAuthenticated();
    // const { accounts } = useMsal();
    // const email = accounts[0] && accounts[0].username;
    // const name = accounts[0] && accounts[0].name;
    // const isStudent = DetectIfStudent(isAuthenticated);
    if(User.isAuthenticated){
        if(User.IsStudent && User.email !== "DJYReid@dundee.ac.uk")
        {
            window.location.replace("/studenthome");
        }
        else{
            return (
                <>
                <div className='signed-in-home-wrapper'>
                <Helmet>
                <title>Welcome { User.name } </title>
                </Helmet>
                    <h1>Welcome lecturer { User.name } </h1>
                    <SignOutButton/>
                </div>
                </>
                );
        }
    }
    else{
        window.location.replace("/");
    }

}