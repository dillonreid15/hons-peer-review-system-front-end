import { useEffect } from "react";
import { UserData } from "../../azure/detectAuth";
export function Redirect(){
    const User = UserData();
    useEffect(() =>{
        if(User.isAuthenticated){
            if(User.IsUoD){
                if(localStorage.getItem('UserCheckComplete') !== 'True'){
                    localStorage.setItem('UserCheckComplete', 'False')
                }
                if(/@dundee.ac.uk\s*$/.test(User.email)){
                    if(User.name.includes("Student")){
                        window.location.replace("/studenthome")
                    }else{
                        window.location.replace("/lecturerhome")
                    }    
                }
            }else{
                window.location.replace("/");
            }
        }
        else{
            window.location.replace("/");
        }
    })

    return(
        <h1>Redirect</h1>
    )
}