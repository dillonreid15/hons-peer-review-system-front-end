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
import { MyAssignedForms } from './components/Lecturer/MyAssignedForms';
import Popup from 'react-popup'
import { ViewForm } from './components/Student/ViewForm';
import { ViewFormLec } from './components/Lecturer/ViewFormLec';
import { ViewTeam } from './components/Lecturer/ViewTeam';
import { ViewStudent } from './components/Lecturer/ViewStudent';

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
                    <Route path="/myassignedforms" element={<MyAssignedForms/>} /> 
                    <Route path="/createform" element={<CreateForm/>} /> 
                    <Route path="/createteam" element={<CreateTeam/>}/>
                    <Route path="/createassignment" element={<CreateAssignment/>}/>
                    <Route path="/viewform" element={<ViewForm/>}/>
                    <Route path="/viewformlec" element={<ViewFormLec/>}/>
                    <Route path="/viewteam" element={<ViewTeam/>}/>
                    <Route path="/viewstudent" element={<ViewStudent/>}/>
                    <Route path ="*" element ={<Redirect/>} />
                </Routes>
            </div>
            <div className="site-footer">
            </div>
        </div>
    )
}



export default App;