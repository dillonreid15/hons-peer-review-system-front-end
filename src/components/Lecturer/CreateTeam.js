import { Helmet } from "react-helmet";
import { UserData } from "../../azure/detectAuth";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useMsal } from "@azure/msal-react";
import './CreateTeam.css'
import Popup from "react-popup";
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

function handleLogout(instance) { 
    secureStorage.removeItem('UserCheckComplete');
    instance.logoutRedirect().catch(e => {
        console.error(e);
    });
}

export function CreateTeam(){
    const User = UserData();
    const { instance } = useMsal();
    const [listOfUsers, setListOfUsers] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [rowsTeam, setRowsTeam] = useState([])
    const [listOfTeamNames, setListOfTeamNames] = useState([])
    const [rows, setRows] = useState([]);
    const columns = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'email', headerName: 'Email', width: 500}
    ]    
    const columnsForTeam = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'email', headerName: 'Email', width: 500}
    ]    

    const handleCreateTeams = () => { 
        const teamname = prompt('Please enter a team name');
        if(teamname === ""){
            Popup.alert('Please enter a valid team name');
        }
        else{
            if(selectedStudents.length === 0){
                Popup.alert('Please select students to add to team');
            }
            else{
                var varNameTaken = false;
                for(const x of listOfTeamNames){
                    if(x === teamname){
                        varNameTaken = true;
                    }
                }
                if(varNameTaken){
                    Popup.alert('Name already taken, please enter a unique name');
                }
                else{
                    var lstUser = listOfUsers;
                    lstUser = lstUser.filter((el) => !selectedStudents.includes(el));
                    setListOfUsers(lstUser);
                    var lstTeam = rowsTeam;
                    for(const x of selectedStudents){
                        lstTeam.push({teamname: teamname, name: x['name'], email: x['email']})
                    }
        
                    setRows(lstUser);
                    setRowsTeam(lstTeam);
                    var teamnames = listOfTeamNames
                    teamnames.push(teamname)
                    setListOfTeamNames(teamnames);
                }
            }
        }        
    }

    const handleRemoveTeam = (i) =>{
        var newTeamList = [];
        for(const x of rowsTeam){
            if(x['teamname'] !== listOfTeamNames[i]){
                newTeamList.push(x);
            }   
        }
        var newTeamNames = [];
        for(const y of listOfTeamNames){
            if(y !== listOfTeamNames[i]){
                newTeamNames.push(y)
            }
        }
        setRowsTeam(newTeamList);
        setListOfTeamNames(newTeamNames);       

    } 

    const rowsLoad = (x) => {
        var listOfStudentWithTeamName = []
        for(const y of rowsTeam){
            if(x === y['teamname']){
                listOfStudentWithTeamName.push(y)
            }
        }
        return listOfStudentWithTeamName;
    }

    const onSubmit = () => {
        var form = {
            "AssignedID" : secureStorage.getItem('assignedid'),
            "AssessmentID": secureStorage.getItem('assessmentid'),
            "DueDate": secureStorage.getItem('duedate'),
            "DueTime": secureStorage.getItem('duetime'),
            "Teams": rowsTeam
        };
        var formString = JSON.stringify(form)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type':  'application/json' },
            body: JSON.stringify({ Form: formString })
        };
        fetch(('//127.0.0.1:5000/uploadformteam'), requestOptions)
        .then((res) => {return res.json()
        .then((data) => {
            secureStorage.removeItem('assignedid');
            secureStorage.removeItem('formname');
            secureStorage.removeItem('formtype');
            secureStorage.removeItem('assessmentid');
            secureStorage.removeItem('duedate');
            secureStorage.removeItem('duetime');
            console.log("File Uploaded");     
            window.location.replace('/lecturerhome')
        });
        });
    }
    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
            if(secureStorage.getItem('UserCheckComplete') === 'True'){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: JSON.stringify({ AssessmentID : String(secureStorage.getItem('assessmentid'))})
                };
                fetch(('//127.0.0.1:5000/loadstudentsforassignment'), requestOptions)
                .then((res) => {return res.json()
                .then((data) => {
                    var MyUsers = []
                    data.forEach((x) => {
                    var ObjectArray = Object.entries(x);
                    MyUsers.push(ObjectArray);                         
                    });
                    console.log("Students Received");     
                    var rowsToPush = []
                    for(const x of MyUsers){ 
                        var row = {name : x[1][1], email : x[0][1]}
                        rowsToPush.push(row);              
                    }
                    setRows(rowsToPush);
                    setListOfUsers(rowsToPush);
                });
                });       
            }
        }
        else{
            window.location.replace('/redirect')
        }
    // eslint-disable-next-line
    }, [])
    return(
        <div className="create-team-wrapper">
            <Helmet>
                <title>Team Assignment</title>
            </Helmet>
            <div className="header-wrapper">
                <h2> Assign Teams to Assessment: {secureStorage.getItem('formname')} </h2>
                <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                <Button className="btn-home" onClick={() => window.location.replace('/lecturerhome')}>Home</Button>
                <Button className="btn-back" onClick={() => window.location.replace('/createform')}>Back</Button>
            </div>
            <div className="form">
                <div className="datagrid-wrapper-1">
                    <div className="datagrid-styler" style={{height: 400, width: '60%'}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowId={(row) => row.email}
                            pageSize={100}
                            rowsPerPageOptions={[100]}
                            checkboxSelection
                            onSelectionModelChange={(ids) =>{
                                const selectedIDs = new Set(ids);
                                const selectedRowData = rows.filter((row) =>
                                selectedIDs.has(row.email)
                                );
                                setSelectedStudents(selectedRowData);
                            }}
                            
                        />
                    </div>
                        <Button className="btn-create-team" onClick={() => handleCreateTeams()}>Create New Team</Button>
                        <Button className="btn-create-team" onClick={() => onSubmit()}>Submit</Button>
                </div>
                {listOfTeamNames.map(function table(value, index){
                    var rowForRender = rowsLoad(value);
                    return(
                        <div className="datagrid-wrapper-2">
                            <div className="datagrid-styler" style={{height: 400, width: '60%'}}>
                                <h4>{listOfTeamNames[index]}</h4>
                                <DataGrid
                                    sx={{float: 0}}
                                    key = {index}
                                    rows={rowForRender}
                                    columns={columnsForTeam}
                                    getRowId={(row) => row.email}
                                    pageSize={100}
                                    rowsPerPageOptions={[100]}
                                    checkboxSelection
                                    onSelectionModelChange={(ids) =>{
                                        const selectedIDs = new Set(ids);
                                        const selectedRowData = rows.filter((row) =>
                                        selectedIDs.has(row.email)
                                        );
                                    }}
                                />
                                
                            </div>
                                <Button onClick={() => handleRemoveTeam(index)}>Delete Team</Button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


/* 
Have one table with a list of existing teams with their students
A second table that has a list of students for the classes 

AFTER DINNER SORT OUT HOW THIS WILL WORK WITH CLASSES I KINDA FORGOT ABOUT THAT OOPSIEEEEE

ALSO FINISH API CALL, IT DOESN't ACTUALLY GET ANY TEAMS OR ANYTHING OOPSIEEEE
*/