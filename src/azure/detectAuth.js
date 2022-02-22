import { useMsal } from "@azure/msal-react";
import React, { useState } from "react";


export function DetectIfStudent() {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    const name = accounts[0] && accounts[0].name;
    
    if(name.includes("Student")){
        return true;
    }
    else{
        return false
    }    
};
    
export function DetectIfUod(){
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    const email = accounts[0] && accounts[0].username;
    
    if(/@dundee.ac.uk\s*$/.test(email)){return true;}
    else{return false}
    };

export function RedirectUser(){
    if(DetectIfUod()){
        if(DetectIfStudent()){
            window.location.replace("/studenthome")
        }
        else{
            window.location.replace("/lecturehome")
        }
    }
    else{
        window.location.replace("/")
    }
}