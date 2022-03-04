import { useMsal } from "@azure/msal-react";

export function Usercheck(){
    
    const { accounts } = useMsal();
    const email = accounts[0] && accounts[0].username;
    const name = accounts[0] && accounts[0].name;
    var isStudent;
    var fullName;
    if(name.includes("Student")){
        isStudent = 1;
        fullName = name.replace(" (Student)", "");
    }
    else{
        isStudent = 0;
        fullName = name.replace(" (Staff)", "");
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/html' },
        body: JSON.stringify({ Email: String(email), IsStudent: Number(isStudent), FullName: String(fullName)})
    };
    fetch('http://127.0.0.1:5000/usercheck', requestOptions)
    .then((res) => {return res.json()
    .then((data) => {
        console.log("User check complete");
    });
    });
}