import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../azure/authConfig";
import Button from "@mui/material/Button";

/**Calls msal login api */
function handleLogin(instance) {
    instance.loginRedirect(loginRequest).catch(e => {
        console.error(e);
    }); 
}

/**
 * Renders a button which, when selected, will redirect the page to the login prompt
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    return (
        <Button variant="contained" className="sign-in-button" onClick={() => handleLogin(instance)}>Sign in</Button>
    );
}