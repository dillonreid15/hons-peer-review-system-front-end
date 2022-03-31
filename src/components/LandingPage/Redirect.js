import { useEffect } from "react";
import { UserData } from "../../azure/detectAuth";
import SecureStorage from "secure-web-storage/secure-storage"

var CryptoJS = require("crypto-js");

// NOTE: Your Secret Key should be user inputed or obtained through a secure authenticated request.
//       Do NOT ship your Secret Key in your code.
var SECRET_KEY = 'my secret key';

var secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key) {
        key = CryptoJS.SHA256(key, SECRET_KEY);

        return key.toString();
    },
    encrypt: function encrypt(data) {
        data = CryptoJS.AES.encrypt(data, SECRET_KEY);

        data = data.toString();

        return data;
    },
    decrypt: function decrypt(data) {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);

        data = data.toString(CryptoJS.enc.Utf8);

        return data;
    }
});


/**Redirects user to correct page based on authentication, authority, role, and whether or not they're registered on the sites database */
export function Redirect(){
    const User = UserData();
    useEffect(() =>{
        if(User.isAuthenticated){
            if(User.IsUoD){
                if(localStorage.getItem('UserCheckComplete') !== 'True'){
                    secureStorage.setItem('UserCheckComplete', 'False')
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