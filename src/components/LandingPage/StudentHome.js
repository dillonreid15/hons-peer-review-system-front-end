import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";
import React, { useEffect } from "react";
import Helmet from 'react-helmet'; 
import { UserData } from "../../azure/detectAuth";

export function StudentHome(){
    const User = UserData();
    useEffect(() =>{
            if(User.isAuthenticated && User.IsUoD){
                var IsStudent;
                if(User.isstudent){
                    IsStudent=1;
                }
                else{
                    IsStudent=0;
                }
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: JSON.stringify({ Email: String(User.email), IsStudent: Number(IsStudent), FullName: String(User.fullName)})
                };
                fetch(('//127.0.0.1:5000/usercheck'), requestOptions)
                .then((res) => {return res.json()
                .then((data) => {
                    console.log("User check complete");
                    localStorage.setItem('UserCheckComplete', 'True');
                });
                });
            }
    }, []);
    if(User.isAuthenticated && User.IsUoD){
        // Usercheck();
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
        window.location.replace("/redirect");
    }
    
}