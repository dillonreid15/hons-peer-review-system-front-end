import './StudentHome.css';
import { SignOutButton } from "../azure/SignOutButton";
import React, { useEffect, useState } from "react";
import Helmet from 'react-helmet'; 
import { UserData } from "../../azure/detectAuth";
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import Button from '@restart/ui/esm/Button';
import SecureStorage from "secure-web-storage/secure-storage"
import { useMsal } from '@azure/msal-react';

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

export function StudentHome(){
    const User = UserData();
    const { instance } = useMsal();
    const [rows, setRows] = useState([])
    const [rowsComplete, setRowsComplete] = useState([])
    const [myForms, setMyForms] = useState([])

    const columns: GridColDef = [
        { field: 'action',
         headerName: '',
          sortable: false,
          filterable: false,
          hideable: false,
        renderCell: (params) => {
            const onClick = (e) => {
                e.stopPropagation();
                secureStorage.setItem('formid', params.row.reviewid)
                window.location.replace('/viewform');
            };
            return <Button onClick={onClick}>View Form</Button>;
          },
        },
        { field: 'reviewname', headerName: 'Review Name', width: 300 },
        { field: 'datedue', headerName: 'Date Due', width: 500}
    ]

    useEffect(() =>{
            if(User.isAuthenticated && User.IsUoD){
                var IsStudent;
                if(User.isstudent){
                    IsStudent=1;
                }
                else{
                    IsStudent=0;
                }
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: JSON.stringify({ Email: String(User.email), IsStudent: Number(IsStudent), FullName: String(User.fullName)})
                };
                fetch(('//127.0.0.1:5000/usercheck'), requestOptions)
                .then((res) => {return res.json()
                .then((data) => {
                    console.log("User check complete");
                    secureStorage.setItem('UserCheckComplete', 'True');
                });
                });
                const requestOptionsAssignments = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: JSON.stringify({ Email: String(User.email)})
                };
                fetch(('//127.0.0.1:5000/getmyassessmentsstudent'), requestOptionsAssignments)
                .then((res) => {return res.json()
                .then((data) => {
                    var MyAssessments = []
                    data.forEach((x) => {
                        var ObjectArray = Object.entries(x);
                        MyAssessments.push(ObjectArray);
                    });
                    setMyForms(MyAssessments);
                    var myRows = []
                    var myRowsComplete = []
                    for(const x of MyAssessments){
                        const datetimeReview = new Date(x[1][1])
                        const currentDate = new Date()
                        if(x[5][1] === 1 && datetimeReview > currentDate){
                            myRows.push({reviewid: x[2][1], reviewname: x[3][1], datedue: x[1][1]}) 
                        }
                        else if(x[5][1] === 0 || datetimeReview < currentDate){
                            myRowsComplete.push({reviewid: x[2][1], reviewname: x[3][1], datedue: x[1][1]}) 
                        }
                    }
                    setRows(myRows);
                    setRowsComplete(myRowsComplete);
                });
                });
            }
            // eslint-disable-next-line
    }, []);
    if(User.isAuthenticated && User.IsUoD){
        // Usercheck();
        if(!User.IsStudent)
        {
            window.location.replace("/lecturehome");
        }
        else{
            return (
                <>
                <div className='signed-in-home-wrapper'>
                <Helmet>
                <title>Welcome { User.name } </title>
                </Helmet>
                    <div className="header-wrapper">
                        <h2>Welcome  student { User.name } </h2>
                        <Button onClick={() => handleLogout(instance)}>Logout</Button>
                    </div>
                    <div className="form">
                        <div className="datagrid-wrapper">
                            <div className="datagrid-styler" style={{height: 400, width: '80%'}}>
                                <DataGrid

                                    rows={rows}
                                    columns={columns}
                                    getRowId={(row) => row.reviewid}
                                    pageSize={100}
                                    rowsPerPageOptions={[100]}
                                />
                            </div>
                            <div className="datagrid-styler" style={{height: 400, width: '80%'}}>
                                <DataGrid
                                    rows={rowsComplete}
                                    columns={columns}
                                    getRowId={(row) => row.reviewid}
                                    pageSize={100}
                                    rowsPerPageOptions={[100]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                </> 
                );
        }
    }
    else{
        window.location.replace("/redirect");
    }
    
}