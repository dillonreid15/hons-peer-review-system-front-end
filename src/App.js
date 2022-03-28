import './App.css';

import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { Routes, Route } from "react-router-dom";
import { StudentHome } from './components/LandingPage/StudentHome';
import { LecturerHome } from './components/LandingPage/LecturerHome';
import uodlogo from './img/logo-white.png'
import { Login } from './components/LandingPage/LoginHandler';
import { Redirect } from './components/LandingPage/Redirect';
import { MyForms } from './components/Lecturer/MyForms';
import { CreateForm } from './components/Lecturer/CreateForm';
import { CreateTeam } from './components/Lecturer/CreateTeam';
import { CreateAssignment } from './components/Lecturer/CreateAssignment';
import Popup from 'react-popup'
import { ViewForm } from './components/Student/ViewForm';
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

function App({pca}) {
  return (
    <MsalProvider instance={pca}>
        <Pages />
    </MsalProvider>
  );
}

function Pages(){
    return(
        <div className="page-container">
            <header id="site-header" className="site-header">
            <img className="uodlogo" src={uodlogo} alt="Brand Logo"/>
            </header>
            <div className="main">
                <Popup/>
                <Routes>
                    <Route path="/lecturerhome" element ={<LecturerHome/>} />
                    <Route path="/studenthome" element ={<StudentHome/>} />
                    <Route path="/" element={<Login/>} />
                    <Route path="/redirect" element={<Redirect/>} /> 
                    <Route path="/myforms" element={<MyForms/>} /> 
                    <Route path="/createform" element={<CreateForm/>} /> 
                    <Route path="/createteam" element={<CreateTeam/>}/>
                    <Route path="/createassignment" element={<CreateAssignment/>}/>
                    <Route path="/viewform" element={<ViewForm/>}/>
                    <Route path ="*" element ={<Redirect/>} />
                </Routes>
            </div>
            <div className="site-footer">
            </div>
        </div>
    )
}



export default App;