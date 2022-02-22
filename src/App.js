import './App.css';
import React, { useState } from "react";
import { PageLayout } from "./PageLayout";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./azure/authConfig";
import Button from "react-bootstrap/Button";
import { ProfileData } from "./components/azure/ProfileData";
import { callMsGraph } from "./azure/graph";
import { Home } from "./components/LandingPage/Home"
import { Routes, Route } from "react-router-dom";
import { SignInButton } from './components/azure/SignInButton';
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
                </Routes>
            </div>
            <div className="site-footer">
            </div>
        </div>
    )
}

{/* <PageLayout>
<AuthenticatedTemplate>
    <ProfileContent />
</AuthenticatedTemplate>
<UnauthenticatedTemplate>
    <p>You are not signed in! Please sign in.</p>
</UnauthenticatedTemplate>
</PageLayout> */}

// function ProfileContent() {
//   const { instance, accounts } = useMsal();
//   const [graphData, setGraphData] = useState(null);

//   const name = accounts[0] && accounts[0].name;

//   function RequestProfileData() {
//       const request = {
//           ...loginRequest,
//           account: accounts[0]
//       };

//       // Silently acquires an access token which is then attached to a request for Microsoft Graph data
//       instance.acquireTokenSilent(request).then((response) => {
//           callMsGraph(response.accessToken).then(response => setGraphData(response));
//       }).catch((e) => {
//           instance.acquireTokenPopup(request).then((response) => {
//               callMsGraph(response.accessToken).then(response => setGraphData(response));
//           });
//       });
//   }

//   return (
//       <>
//           <h5 className="card-title">Welcome {name}</h5>
//           {/* {graphData ? 
//               <ProfileData graphData={graphData} />
//               :
//               <Button variant="secondary" onClick={RequestProfileData}>Request Profile Information</Button>
//           } */}
//       </>
//   );
// };

export default App;