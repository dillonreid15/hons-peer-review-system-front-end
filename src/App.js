import './App.css';
<<<<<<< Updated upstream
import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { Routes, Route } from "react-router-dom";
import { StudentHome } from './components/LandingPage/StudentHome';
import { LecturerHome } from './components/LandingPage/LecturerHome';
import uodlogo from './img/logo.png'
import { Login } from './components/LandingPage/LoginHandler';
import { Redirect } from './components/LandingPage/Redirect';
import { MyForms } from './components/Lecturer/MyForms';


function App({pca}) {
=======
import React, { useState } from "react";
import { PageLayout } from "./PageLayout";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./azure/authConfig";
import Button from "react-bootstrap/Button";
import { callMsGraph } from "./azure/graph";


function App() {
>>>>>>> Stashed changes
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
                <Routes>
                    <Route path="/lecturerhome" element ={<LecturerHome/>} />
                    <Route path="/studenthome" element ={<StudentHome/>} />
                    <Route path="/" element={<Login/>} />
                    <Route path="/redirect" element={<Redirect/>} /> 
                    <Route path="/myforms" element={<MyForms/>} /> 
                    <Route path ="*" element ={<Redirect/>} />
                </Routes>
            </div>
            <div className="site-footer">
            </div>
        </div>
    )
}



export default App;