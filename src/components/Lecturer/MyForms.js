import { useEffect } from "react";
import { UserData } from "../../azure/DetectAuth";

export function MyForms(){
    const User = UserData();
    useEffect(() =>{
        if(localStorage.getItem('UserCheckComplete') == 'True'){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'text/html' },
                body: JSON.stringify({ Email: String(User.email)})
            };
            fetch(('//127.0.0.1:5000/getmymodules'), requestOptions)
            .then((res) => {return res.json()
            .then((data) => {
                var MyModules = []
                    data.forEach((x) => {
                       var ObjectArray = Object.entries(x);
                       MyModules.push(ObjectArray);                         
                    });
                console.log("Modules Received");
                console.log(MyModules);
                
            });
            });
        }
        else(window.location.replace('/redirect'))
    }, [])

    return(<h1>Yoink</h1>)

}