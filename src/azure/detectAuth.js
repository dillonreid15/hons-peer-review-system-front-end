import { useIsAuthenticated, useMsal } from "@azure/msal-react";

/**Returns all data for current logged in user if any exists */
export function UserData(){
    //Returns true if user is authenticated
    const isAuthenticated = useIsAuthenticated();
    //Get user account from microsoft authenticator
    const { accounts } = useMsal();
    var email="";
    var name="";
    var fullName="";
    var IsUoD = false;
    var IsStudent=false;
    if(isAuthenticated){
        email = accounts[0] && accounts[0].username;
        name = accounts[0] && accounts[0].name;
        //Checks if logged in user has a @dundee.ac.uk email address
        if(/@dundee.ac.uk\s*$/.test(email)){
            IsUoD=true;}
        else{
            IsUoD=false}
            
            //Check if authenticated user is a student or staff
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