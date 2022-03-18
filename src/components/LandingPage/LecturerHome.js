import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";
import { UserData } from "../../azure/detectAuth";
import React from "react";
import Helmet from 'react-helmet'; 
import { useEffect } from "react";
import Button from "react-bootstrap/Button";

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
                    <Button ClassName="btn-createform" onClick={() => window.location.replace('/createform')}>Add Review Form For Assignment</Button>
                    <Button ClassName="btn-myform" onClick={() => window.location.replace('/myforms')}>View Previously Assigned Forms</Button>
                    <Button ClassName="btn-addassignment" onClick={() => window.location.replace('/createassignment')}>Add Module Assignment</Button>
                    <Button ClassName="btn-addassignment" onClick={() => window.location.replace('/createteam')}>Create Teams</Button>
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