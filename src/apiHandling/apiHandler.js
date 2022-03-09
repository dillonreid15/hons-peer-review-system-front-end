import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { UserData } from "../azure/detectAuth";

const ip = '//127.0.0.1:5000';

export function Usercheck(){
    const User = UserData();
    var isstudent;
    if(User.IsStudent){
        isstudent=1;
    }
    else{
        isstudent=0;
    }
    localStorage.setItem('Email', User.email);
    localStorage.setItem('IsStudent', User.IsStudent);
    localStorage.setItem('FullName', User.fullName);   
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/html' },
        body: JSON.stringify({ Email: String(User.email), IsStudent: Number(isstudent), FullName: String(User.fullName)})
    };
    fetch((ip+'/usercheck'), requestOptions)
    .then((res) => {return res.json()
    .then((data) => {
        console.log("User check complete");
        return true;
    });
    });
}

function nameCheck(name){

}

export function GetMyFormsList(){
    const User = UserData();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/html'},
        body: JSON.stringify({Email: String(User.email)})
    }
}

export function CheckForExistingAssignment(){
    const User = UserData();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/html'},
        body: JSON.stringify({Email: String(User.email)})
    }
}

export function GenerateMyData(){
    const User = UserData();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/html'},
        body: JSON.stringify({Email: String(User.email)})
    }
}


// export function GetMyTeamRequestsList(){
//     const { accounts } = useMsal();
//     const email = accounts[0] && accounts[0].username;
//     const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'text/html'},
//         body: JSON.stringify({Email: String(email)})
//     }
// }