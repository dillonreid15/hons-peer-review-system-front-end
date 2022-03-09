import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Usercheck } from "../apiHandling/apiHandler";

export function RedirectUser(){
    const User = UserData();
    if(User.isAuthenticated){
        if(User.IsUoD){
            if(User.IsStudent){
                window.location.replace("/studenthome")
            }
            else{
                window.location.replace("/lecturehome")
            }
        }
        else{
            window.location.replace("/login")
        }
    }
    else{
        window.location.replace('/login');
    }
    return(<h1>Loading...</h1>)
}

export function RedirectUserLogin(){
    const User = UserData();
    if(User.isAuthenticated){
        if(User.IsUoD()){         
            if(User.IsStudent){
                window.location.replace("/studenthome")
            }
            else{
                window.location.replace("/lecturehome")
            }
        }
        else{
            window.location.replace("/login")
        }
    }
}

export function UserData(){
    const isAuthenticated = useIsAuthenticated();
    const { accounts } = useMsal();
    var email="";
    var name="";
    var fullName="";
    var IsUoD = false;
    var IsStudent=0;
    var fullName="";
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