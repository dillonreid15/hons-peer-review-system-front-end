import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { SignOutButton } from "../components/azure/SignOutButton";

export function RedirectUser(){
    return(<div><h1>Redirect page</h1><SignOutButton/></div>)
}

export function UserData(){
    const isAuthenticated = useIsAuthenticated();
    const { accounts } = useMsal();
    var email="";
    var name="";
    var fullName="";
    var IsUoD = false;
    var IsStudent=false;
    if(isAuthenticated){
        email = accounts[0] && accounts[0].username;
        name = accounts[0] && accounts[0].name;
        if(/@dundee.ac.uk\s*$/.test(email)){IsUoD=true;}
        else{IsUoD=false}

            if(name.includes("Student")){
                IsStudent=true;
                fullName = name.replace(" (Student)", "");
            }
            else{
                IsStudent=false
                fullName = name.replace(" (Staff)", "");
            }    
    }
    const User = { email, name, fullName, isAuthenticated, IsStudent, IsUoD}
    return User;
}