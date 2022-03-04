import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal} from "@azure/msal-react";
import { AuthorizedComponent,Login } from "./UnauthorizedComponent";
import './Home.css';
import React from "react";
import { DetectIfUod, RedirectUser } from "../../azure/detectAuth";
import { render } from "@testing-library/react";



export function Loading(){
    const isAuthenticated = useIsAuthenticated();
    const { accounts } = useMsal();
    var name = "";
    if(isAuthenticated){
        const isUoD = DetectIfUod();
        if(isUoD){
            RedirectUser();
        }
        else{
            RedirectUser();
        }
    }
    else{
        RedirectUser();
    }
}


  