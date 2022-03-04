import './App.css';
import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { Loading } from "./components/LandingPage/Loading"
import { Routes, Route } from "react-router-dom";
import { StudentHome } from './components/LandingPage/StudentHome';
import { LecturerHome } from './components/LandingPage/LecturerHome';
import { PageNotFound } from './components/LandingPage/PageNotFound';
import uodlogo from './img/logo.png'
import { Login } from './components/LandingPage/UnauthorizedComponent';
import { RedirectUser } from './azure/detectAuth';


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
                <Routes>
                    <Route path="/lecturerhome" element ={<LecturerHome/>} />
                    <Route path="/studenthome" element ={<StudentHome/>} />
                    <Route path="/login" element ={<Login/>} />
                    <Route path ="*" element ={<RedirectUser/>} />
                </Routes>
            </div>
            <div className="site-footer">
            </div>
        </div>
    )
}



export default App;