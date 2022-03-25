import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "@mui/material/Button";

/**Calls msal login api */
function handleLogout(instance) { 
    localStorage.removeItem('UserCheckComplete');
    instance.logoutRedirect().catch(e => {
        console.error(e);
    });
}

/**
 * Renders a button which, when selected, will redirect the page to the logout prompt
 */
export const SignOutButton = () => {
    const { instance } = useMsal();

    return (
        <Button variant="secondary" className="sign-in-button" onClick={() => handleLogout(instance)}>Sign out</Button>
    );
}