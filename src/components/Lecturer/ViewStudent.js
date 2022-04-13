import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import Helmet from 'react-helmet';
import SecureStorage from "secure-web-storage";
import Button from "@mui/material/Button";
import { UserData } from "../../azure/detectAuth";
import { TextField } from "@mui/material";
import './ViewStudent.css'

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

function handleLogout(instance) { 
    secureStorage.removeItem('UserCheckComplete');
    instance.logoutRedirect().catch(e => {
        console.error(e);
    });

}

export function ViewStudent(){
    const User = UserData();
    const { instance } = useMsal()
    const [cat, setCat] = useState([]);

    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated /*&& (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")*/){
            if(secureStorage.getItem('UserCheckComplete') === 'True'){
                if(secureStorage.getItem('assignedid') === '' || secureStorage.getItem('assignedid') === null ){
                    window.location.replace('/redirect')
                }
                else
                {
                    if(secureStorage.getItem('teamid') === '' || secureStorage.getItem('teamid') === null){
                        window.location.replace('/redirect')
                    }
                    else{
                        if(secureStorage.getItem('email') === '' || secureStorage.getItem('email') === null){
                            window.location.replace('/redirect')
                        }
                        else{ 
                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'text/html' },
                                body: JSON.stringify({ TeamID: secureStorage.getItem('teamid'), Email: secureStorage.getItem('email')})
                            };
                            fetch(('https://hons-peer-review-api.herokuapp.com/getstudentforassignment'), requestOptions)
                            .then((res) => {return res.json()
                            .then((data) => {
                                console.log(data);
                                var cats = []
                                for(const x of data[0]['SubmittedFormJSON']){
                                    if(x['Email'] == secureStorage.getItem('email')){
                                        for(const y of x['Form']){
                                            cats.push(y)
                                        }
                                    }
                                }
                                setCat(cats);
                                console.log(cats)

                            });
                            });
                        }
                    }
                }
            }
            else{
                window.location.replace('/redirect')
            }
        }
        else{
            window.location.replace('/redirect')
        }
        // eslint-disable-next-line
    }, [])
    if(cat.length == 0){
        return(
            <>
            <div className="view-form-wrapper">
                <Helmet>
                    <title>No Form Found</title>
                </Helmet>
                <div className='heading'>
                    <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                    <Button className="btn-home" onClick={() => window.location.replace('/lecturerhome')}>Home</Button>
                    <Button className="btn-back" onClick={() => window.location.replace('/viewteam')}>Back</Button>
                </div>
                <div className="no-form">
                    <h1>No Form Found</h1>
                </div>
            </div>
            </>
        )
    }
    else
    {
        return(
            <>
            <div className="view-form-wrapper">
                <Helmet>
                    <title>{secureStorage.getItem('email')}</title>
                </Helmet>
                <div className='heading'>
                    <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                    <Button className="btn-home" onClick={() => window.location.replace('/lecturerhome')}>Home</Button>
                    <Button className="btn-back" onClick={() => window.location.replace('/viewteam')}>Back</Button>
                    <h2>{secureStorage.getItem('email')}</h2>
                </div>
                <div className="cat-wrapper">
                    {cat.map((eCat, iCat) => (
                        <div className="inside-cat-wrapper">
                            <h4>{eCat.Category}</h4>
                            <div className="student-wrapper">
                                {eCat['Student'].map((eStudent, iStudent) => (
                                    <div className="inside-student-wrapper">
                                        <h4>Student: {eStudent['Email']}</h4>
                                        <h4>Suggested Mark: {eStudent['SuggestedMark']}</h4>
                                        <TextField
                                            id="outlined-multiline-flexible"
                                            multiline
                                            maxRows={4}
                                            value={eStudent['Comment']}
                                            disabled
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>


                    ))}
                </div>
            </div>
            </>
                )
       }
}