import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { UserData } from "../../azure/detectAuth";
import { Helmet } from "react-helmet";
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

export function MyForms(){
    const [listModules, setListModules] = useState([]);

    const User = UserData();
    
    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
            if(secureStorage.getItem('UserCheckComplete') === 'True'){
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
                    setListModules(MyModules);         
                });
                });
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

    return(
        <div>
            <Helmet>
                <title>My Forms</title>
            </Helmet>
            <h1>Yoink</h1>
            <ListGroup>
                {listModules.map(function name(value, index){
                    return <ListGroup.Item key={ index }>
                        <a>
                           {value[1][1]}
                        </a>
                    </ListGroup.Item>
                })}
            </ListGroup>
        </div>


        )

}