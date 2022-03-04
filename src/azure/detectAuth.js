import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Usercheck } from "../apiHandling/apiHandler";

export function DetectIfStudent() {
    const { accounts } = useMsal();
    var isAuthenticated = useIsAuthenticated();
    var name = "";
    if(isAuthenticated){
    name = accounts[0] && accounts[0].name;
    
    if(name.includes("Student")){
        return true;
    }
    else{
        return false
    }    
}
};
    
export function DetectIfUod(){
    const { accounts } = useMsal();
    const email = accounts[0] && accounts[0].username;
    
    if(/@dundee.ac.uk\s*$/.test(email)){return true;}
    else{return false}
    };

export function RedirectUser(){
    const isAuthenticated = useIsAuthenticated();
    if(isAuthenticated){
        if(DetectIfUod()){
            if(DetectIfStudent()){
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