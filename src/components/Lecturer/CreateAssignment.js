import { useState } from "react";
import { Helmet } from "react-helmet";
import { UserData } from "../../azure/detectAuth";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import './CreateAssignment.css';
import Popup from "react-popup";
import SecureStorage from "secure-web-storage/secure-storage";
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


export function CreateAssignment(){

    const { instance } = useMsal();

    //list of modules for signed in user
    const [myModules, setMyModules] = useState([]);

    //store list of selected lecturers to be assigned to this assignment
    const [assignedLecturers, setAssignedLecturers] = useState([]);

    //store selected module id 
    const [selectedModuleID, setSelectedModuleID] = useState('');

    //store selected module name
    const [selectedModuleName, setSelectedModuleName] = useState('');

    //used to load table and table rows
    const [loadMyTable, setTable] = useState([]);
    const [rows, setRows] = useState([]);

    //stores name and type of assignment
    const [allValues, setAllValues] = useState({
        assignmentname: 'My Assignment',
    });
    const User = UserData();

    const columns = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'email', headerName: 'Email', width: 500}
    ]    

    // const IntdeterminateCheckbox = forwardRef(
    //     ({indeterminate, ...rest}, ref) =>{
    //         const defaultRef = useRef()
    //         const resolvedRef = ref || defaultRef

    //         useEffect
    //     }
    // )



    const onSubmit = (e) => {
        e.preventDefault();

        if(allValues.assignmentname === "" || selectedModuleID === ""){
            Popup.alert("ALL FIELDS MUST HAVE VALUES")
        }
        else{
        //Creates json file to be uploaded for the created assignment 
        var formjson = {
             "assessmentname" : allValues.assignmentname,
             "lecturersformodule" : assignedLecturers,
             "creatoremail" : User.email,
             "moduleid" : selectedModuleID
            };
            var formString = JSON.stringify(formjson)
            //api call to upload created assignment 
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Form: formString})
            };
            fetch(('//127.0.0.1:5000/createassignment'), requestOptions)
            .then((res) => {return res.json()
            .then((data) => {
                console.log("File Uploaded");     
                secureStorage.setItem('formname', allValues.assignmentname);
                secureStorage.setItem('assessmentid', data)
                window.location.replace('/createform');
            });
            });            
        }
    }

    //Handles change of assignment name
    const handleChangeName = (e) => {
        setAllValues({...allValues, [e.target.name]: e.target.value})
    }   

    //api call to get list of lecturers for selected assignment
    const getLecturersForModule = (value, name, e) => {
        setSelectedModuleName(name);
        setSelectedModuleID(value);
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'text/html' },
            body: JSON.stringify({ModuleID : String(value), Email: User.email})
        };
        fetch(('//127.0.0.1:5000/getlecturersformodule'), requestOptions)
        .then((res) => {return res.json()
        .then((data) => {
            var MyLecturers = []
            const rowsToPush=[];
            data.forEach((x) =>{
                var ObjectArray = Object.entries(x);
                MyLecturers.push(ObjectArray);
            });
            //setTable will trigger the table of lecturers to be rendered
            setTable(['table']);
            console.log("Lecturers received");   
            for(const x of MyLecturers){
                var row = {name : x[1][1], email : x[0][1]}
                rowsToPush.push(row);
            }  
            setRows(rowsToPush);;
        });
        });    
    }

    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated /*&& (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk") */){
            if(secureStorage.getItem('UserCheckComplete') === 'True'){
                //api call to get list of modules the user is assigned to 
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
                    setMyModules(MyModules);          
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
        <div className="create-assignment-wrapper">
            <Helmet>
                <title>Create Assignment</title>
            </Helmet>
            <div className="header-wrapper">
                <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                <Button className="btn-home" onClick={() => window.location.replace('/lecturerhome')}>Home</Button>
            </div>
            <div className="form">
                <form onSubmit={e => { onSubmit(e) }}>
                    <label className="lbl-assignment-name">
                        Assignment Name: {" "}
                        <input 
                            type="text"
                            name="assignmentname"
                            value={allValues.assignmentname}
                            onChange={e => {handleChangeName(e)}} 
                        />
                    </label>
                    <ListGroup>
                        {/* dynamically load ListGroup Items for each module the user is assigned to */}
                        {myModules.map(function name(value, index){
                            return <ListGroup.Item action active variant="primary" name={ value } key={ index } onClick={e => getLecturersForModule(value[0][1], value[1][1], e)}>
                                    {value[1][1]}
                                    </ListGroup.Item>
                        })}
                    </ListGroup>
                    {/* dynamically load table of lecturers once loadMyTable state has been updated */}
                    {loadMyTable.map(function table(value, index){
                        return( 
                            <div style={{height: 400, width: '100%'}}>
                                <h4>{selectedModuleName}</h4>
                                <DataGrid
                                    key = {index}
                                    rows={rows}
                                    columns={columns}
                                    getRowId={(row) => row.email}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    checkboxSelection
                                    onSelectionModelChange={(ids) =>{
                                        const selectedIDs = new Set(ids);
                                        const selectedRowData = rows.filter((row) =>
                                        selectedIDs.has(row.email)
                                        );
                                        setAssignedLecturers(selectedRowData);
                                    }}
                                />
                            </div>
                    )})}
                    <div className="submit-wrapper">
                        <Button className="btn-submit" type="submit">Create</Button>
                    </div>

                </form>
            </div>
        </div>
    )
}