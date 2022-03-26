import './Home.css';
import { UserData } from "../../azure/detectAuth";
import React from "react";
import Helmet from 'react-helmet'; 
import { useEffect } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import { useMsal } from '@azure/msal-react';

/**Logout function that removes UserCheck from localStorage, only required during test */
function handleLogout(instance) { 
    localStorage.removeItem('UserCheckComplete');
    instance.logoutRedirect().catch(e => {
        console.error(e);
    });
}

export function LecturerHome(){
    const User = UserData();
    const { instance } = useMsal();
    useEffect(() =>{
        if(User.isAuthenticated && User.IsUoD){
            var IsStudent;
            if(User.isstudent){
                IsStudent=1;
            }
            else{
                IsStudent=0;
            }
            /*Api call to check if user exists on database, if not, add user to database*/
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
// eslint-disable-next-line
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
                        <h2>Welcome { User.name } </h2>
                        <div className="button-wrapper">
                            <ButtonGroup 
                            orientation="vertical"
                            size="large">
                                <Button onClick={() => window.location.replace('/createassignment')}>New Assignment</Button>
                                <Button onClick={() => window.location.replace('/myforms')}>View Previously Assigned Forms</Button>
                                <Button onClick={() => handleLogout(instance)}>Sign out</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </>
                );
            }
    }
    else{
        window.location.replace("redirect");
    }
}