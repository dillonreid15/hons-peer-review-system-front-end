import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";
import { UserData } from "../../azure/DetectAuth";
import React from "react";
import Helmet from 'react-helmet'; 
import { useEffect } from "react";
import Button from '@restart/ui/esm/Button';

export function LecturerHome(){
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
            // const requestOptionsModules = {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'text/html' },
            //     body: JSON.stringify({ Email: String(User.email)})
            // };
            // fetch(('//127.0.0.1:5000/getmymodules'), requestOptionsModules)
            // .then((res) => {return res.json()
            // .then((data) => {
            //     console.log("Module check complete");
            //     return true;
            // });
            // });
        }
}, []);
    if(User.isAuthenticated && User.IsUoD){
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
                    <Button>Create New Form</Button>
                    <Button onClick={() => window.location.replace('/myforms')}>View Previously Created Forms</Button>
                    <SignOutButton/>
                    {/* <LecturerHomeView/> */}
                </div>
                </>
                );
            }
    }
    else{
        window.location.replace("redirect");
    }
}