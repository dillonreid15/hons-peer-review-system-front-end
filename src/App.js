import './App.css';
import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { Home } from "./components/LandingPage/Home"
import { Routes, Route } from "react-router-dom";
import { StudentHome } from './components/LandingPage/StudentHome';
import { LecturerHome } from './components/LandingPage/LecturerHome';
import { PageNotFound } from './components/LandingPage/PageNotFound';
import uodlogo from './img/logo.png'


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
                    <Route path="/" element={<Home />} />
                    <Route path="/lecturerhome" element ={<LecturerHome/>} />
                    <Route path="/studenthome" element ={<StudentHome/>} />
                    <Route path ="*" element ={<PageNotFound/>} />
                </Routes>
            </div>
            <div className="site-footer">
            </div>
        </div>
    )
}



export default App;