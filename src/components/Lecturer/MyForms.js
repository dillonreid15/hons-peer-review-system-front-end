import { useEffect, useState } from "react";
import { UserData } from "../../azure/detectAuth";
import { Helmet } from "react-helmet";
import SecureStorage from "secure-web-storage/secure-storage"
import Button from "@mui/material/Button";
import { DataGrid } from '@mui/x-data-grid';
import './MyForms.css'
import { useMsal } from "@azure/msal-react";

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

export function MyForms(){
    const { instance } = useMsal();
    const User = UserData();
    const [rows, setRows] = useState([])
    const [rowsComplete, setRowsComplete] = useState([])
    const [rowsDue, setRowsDue] = useState([])


    const columns: GridColDef = [
        { field: 'action',
         headerName: '',
          sortable: false,
          filterable: false,
          hideable: false,
        renderCell: (params) => {
            const onClick = (e) => {
                e.stopPropagation();
                secureStorage.setItem('assignedid', params.row.assignedid)
                secureStorage.setItem('formpage', 'myforms')
                window.location.replace('/viewformlec');
            };
            return <Button onClick={onClick}>View Form</Button>;
          },
        },
        { field: 'reviewname', headerName: 'Review Name', width: 300 },
        { field: 'datedue', headerName: 'Date Due', width: 500}
    ]

    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated /* && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")*/){
            if(secureStorage.getItem('UserCheckComplete') === 'True'){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: JSON.stringify({ Email: String(User.email)})
                };
                fetch(('https://hons-peer-review-api.herokuapp.com/loadlecturerhomeforms'), requestOptions)
                .then((res) => {return res.json()
                .then((data) => {
                    var MyAssessments = []
                    data.forEach((x) => {
                        var ObjectArray = Object.entries(x);
                        MyAssessments.push(ObjectArray);
                        //console.log(x);
                    });
                    const uniqueIds = [];
                    // eslint-disable-next-line
                    const unique = MyAssessments.filter(x => {
                        const isDup = uniqueIds.includes(x[0][1]);
                        if(!isDup){
                            uniqueIds.push(x[0][1]);
                            return true;
                        }
                    });
                    //console.log(MyAssessments);
                   // console.log(unique);
                    var myRows = []
                    var myRowsDue = []
                    var myRowsCompleted = []

                    for(const x of unique){
                        const datetimeReview = new Date(x[1][1])
                        const currentDate = new Date()
                        if(x[5][1] === 0){
                            myRowsCompleted.push({assignedid: x[0][1], reviewname: x[3][1], datedue: x[1][1]})
                        }
                        else if(datetimeReview < currentDate){
                            myRowsDue.push({assignedid: x[0][1], reviewname: x[3][1], datedue: x[1][1]})
                        }
                        else{
                            myRows.push({assignedid: x[0][1], reviewname: x[3][1], datedue: x[1][1]})
                        }
                    }
                    secureStorage.removeItem('assignedid');
                    setRows(myRows);
                    setRowsComplete(myRowsCompleted);
                    setRowsDue(myRowsDue);
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
        <div className='lecturer-forms-wrapper'>
            <Helmet>
                <title>My Forms</title>
            </Helmet>
            <div className="header-wrapper">
                <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                <Button className="btn-home" onClick={() => window.location.replace('/lecturerhome')}>Home</Button>
                <h2>Welcome { User.name }</h2>
            </div>
            <div className="form">
                <div className="datagrid-wrapper">
                    <h2>Current Assignments</h2>
                    <div className="datagrid-styler" style={{height: 400, width: '80%'}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowId={(row) => row.assignedid}
                            pageSize={100}
                            rowsPerPageOptions={[100]}
                        />
                    </div>
                    <h2>Due Assignments</h2>
                    <div className="datagrid-styler" style={{height: 400, width: '80%'}}>
                        <DataGrid
                            rows={rowsDue}
                            columns={columns}
                            getRowId={(row) => row.assignedid}
                            pageSize={100}
                            rowsPerPageOptions={[100]}
                        />
                    </div>
                    <h2>Completed Assignments</h2>
                    <div className="datagrid-styler" style={{height: 400, width: '80%'}}>
                        <DataGrid
                            rows={rowsComplete}
                            columns={columns}
                            getRowId={(row) => row.assignedid}
                            pageSize={100}
                            rowsPerPageOptions={[100]}
                        />
                    </div>
                </div>
            </div>
        </div>


        )

}