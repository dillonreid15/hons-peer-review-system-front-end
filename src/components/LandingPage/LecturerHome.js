import './Home.css';
import { UserData } from "../../azure/detectAuth";
import React from "react";
import Helmet from 'react-helmet'; 
import { useEffect } from "react";
import Button from "@mui/material/Button";
import { useMsal } from '@azure/msal-react';
import SecureStorage from "secure-web-storage/secure-storage"

var CryptoJS = require("crypto-js");

// NOTE: Your Secret Key should be user inputed or obtained through a secure authenticated request.
//       Do NOT ship your Secret Key in your code.
var SECRET_KEY = 'my secret key';

var secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key) {
        key = CryptoJS.SHA256(key, SECRET_KEY);

        return key.toString();
    },
    encrypt: function encrypt(data) {
        data = CryptoJS.AES.encrypt(data, SECRET_KEY);

        data = data.toString();

        return data;
    },
    decrypt: function decrypt(data) {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);

        data = data.toString(CryptoJS.enc.Utf8);

        return data;
    }
});

/**Logout function that removes UserCheck from localStorage, only required during test */
function handleLogout(instance) { 
    secureStorage.removeItem('UserCheckComplete');
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
            fetch(('https://hons-peer-review-api.herokuapp.com/usercheck'), requestOptions)
            .then((res) => {return res.json()
            .then((data) => {
                console.log("User check complete");
                
                secureStorage.setItem('UserCheckComplete', 'True');
            });
            });

            /* Delete unfinished forms or assignments*/
            if(secureStorage.getItem('assessmentid') !== null || secureStorage.getItem('assignedid' ) !== null){
                const requestOptionsForm = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: JSON.stringify({ AssessmentID : secureStorage.getItem('assessmentid')})
                };
                fetch(('https://hons-peer-review-api.herokuapp.com/deleteunfinished'), requestOptionsForm)
                .then((res) => {return res.json()
                .then((data) => {
                    console.log("Deleted Unused Content");
                    secureStorage.setItem('UserCheckComplete', 'True');
                });
                });
                if(secureStorage.getItem('assessmentid') !== null){
                    secureStorage.removeItem('assessmentid')
                    secureStorage.removeItem('formname')
                    secureStorage.removeItem('formid');
                }
                if(secureStorage.getItem('assignedid') !== null){
                    secureStorage.removeItem('assignedid')
                    secureStorage.removeItem('duedate')
                    secureStorage.removeItem('duetime')
                    secureStorage.removeItem('formid');
                }
            }
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
                            <Button onClick={() => window.location.replace('/createassignment')}>New Assignment</Button>
                            <Button onClick={() => window.location.replace('/myforms')}>View My Created Forms</Button>
                            <Button onClick={() => window.location.replace('/myassignedforms')}>View My Assigned Forms</Button>
                            <Button onClick={() => handleLogout(instance)}>Sign out</Button>
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