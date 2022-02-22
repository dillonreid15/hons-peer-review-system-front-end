import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import { UnauthorizedComponent } from "./UnauthorizedComponent";
import './Home.css';
import { SignOutButton } from "../azure/SignOutButton";

export function Home(){
    return (
        <>
        <div className='home-wrapper'>
        <AuthenticatedTemplate>
            <h1>You are signed in </h1>
            <SignOutButton/>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
            <UnauthorizedComponent/>
        </UnauthenticatedTemplate>
        </div>
        </>
        );
}