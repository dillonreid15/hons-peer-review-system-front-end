import { useEffect, useState } from "react";
import { UserData } from "../../azure/detectAuth";
import { Helmet } from "react-helmet";
import SecureStorage from "secure-web-storage/secure-storage"
import Button from "@mui/material/Button";
import { DataGrid } from '@mui/x-data-grid';
import Popup from "react-popup";
import { useMsal } from "@azure/msal-react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import './ViewFormLec.css'

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

export function ViewFormLec(){
    const { instance } = useMsal();
    const User = UserData();
    const [rows, setRows] = useState([]);
    const [assessment, setMyAssessment] = useState([]);

    const backHandle = () =>{
        if(secureStorage.getItem('formpage') === 'myassignedforms'){
            window.location.replace('/myassignedforms');
        }
        else if(secureStorage.getItem('formpage') === 'myforms'){
            window.location.replace('/myforms');
        }
    }

    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToCSV = (apiData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(apiData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

    const exportGrades = (e) =>{
        var updatedGrades = true;
        for(const x of rows){
            if(x['groupmark'] == null){
                updatedGrades = false;
            }
        }
        if(!updatedGrades){
            Popup.alert("Please Apply Grade to all Teams before Exporting")
        }
        else{
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'text/html' },
                body: JSON.stringify({ FormID: secureStorage.getItem('assignedid')})
            };
            fetch(('//127.0.0.1:5000/exportgrades'), requestOptions)
            .then((res) => {return res.json()
            .then((data) => {
                const students = data[0];
                const teams = data[1];
                const users = data[2];
                const gradeToExport = [];
                var allTeamHasGrade = true;
                for(const x of teams){
                    if(x['GroupMark'] == null){
                        allTeamHasGrade = false;
                    }
                    else{
                        for(const y of students)
                        if(x['TeamsID'] == y['TeamID']){
                            for(const z of users){
                                if(y['Email'] == z['Email']){
                                    const fullName = z['FullName'].replace(" (Student)", "");
                                    gradeToExport.push({
                                        Name: fullName,
                                        Email: y['Email'],
                                        TeamName: x['TeamName'],
                                        GroupMark: x['GroupMark'],
                                        GroupGrade: x['GroupGrade'],
                                        ModulatedMark: y['ModulatedMark'],
                                        ModulatedGrade: y['ModulatedGrade'] })
                                }
                            }
                        }
                    }
                }
                if(!allTeamHasGrade){
                    Popup.alert("Please give all teams a grade before exporting")
                }
                else{
                    const assessmentname = assessment[0]['AssessmentName']
                    const filename = (assessmentname + ' Grades');
                    exportToCSV(gradeToExport, filename);
                    console.log(gradeToExport);
                }
            });
            });
        }
    }

    const setComplete = (e) =>{
        var updatedGrades = true;
        for(const x of rows){
            if(x['groupmark'] == null){
                updatedGrades = false;
            }
        }
        if(!updatedGrades){
            Popup.alert("Please Apply Grade to all Teams before Exporting")
        }
        else{
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'text/html' },
                body: JSON.stringify({ FormID: secureStorage.getItem('assignedid')})
            };
            fetch(('//127.0.0.1:5000/settocomplete'), requestOptions)
            .then((res) => {return res.json()
            .then((data) => {
                backHandle();
            });
            });
        }
    }
    const emailGrades = (e) =>{
        var updatedGrades = true;
        for(const x of rows){
            if(x['groupmark'] == null){
                updatedGrades = false;
            }
        }
        if(!updatedGrades){
            Popup.alert("Please Apply Grade to all Teams before Emailing")
        }
        else{
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'text/html' },
                body: JSON.stringify({ FormID: secureStorage.getItem('assignedid'), Email: User.email})
            };
            fetch(('//127.0.0.1:5000/emailgrades'), requestOptions)
            .then((res) => {return res.json()
            .then((data) => {
                Popup.alert('Results Successfully Emailed')
            });
            });
        }
    }
    const emailReminder = (e) =>{
        var updatedGrades = true;
        for(const x of rows){
            if(x['groupmark'] == null){
                updatedGrades = false;
            }
        }
        if(!updatedGrades){
            Popup.alert("Please Apply Grade to all Teams before Emailing")
        }
        else{
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'text/html' },
                body: JSON.stringify({ FormID: secureStorage.getItem('assignedid'), Email: User.email})
            };
            fetch(('//127.0.0.1:5000/emailreminder'), requestOptions)
            .then((res) => {return res.json()
            .then((data) => {
                Popup.alert('Results Successfully Emailed')
            });
            });
        }
    }

    const columns: GridColDef = [
        { field: 'action',
         headerName: '',
          sortable: false,
          filterable: false,
          hideable: false,
        renderCell: (params) => {
            const onClick = (e) => {
                e.stopPropagation();
                secureStorage.setItem('teamid', params.row.teamid)
                window.location.replace('/viewteam');
            };
            return <Button onClick={onClick}>View Team</Button>;
          },
        },
        { field: 'teamname', headerName: 'Team Name', width: 150 },
        { field: 'noofstudentscompleted', headerName: 'Students Completed', width: 150 },
        { field: 'noofstudentsassigned', headerName: 'Students Assigned', width: 150 },
        { field: 'groupmark', headerName: 'Group Mark', width: 150 },
        { field: 'groupgrade', headerName: 'Group Grade', width: 150 }
    ]

    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
            if(secureStorage.getItem('UserCheckComplete') === 'True'){
                if(secureStorage.getItem('assignedid') === '' || secureStorage.getItem('assignedid') === null){
                    window.location.replace('/redirect')
                }
                else{
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/html' },
                        body: JSON.stringify({ FormID: secureStorage.getItem('assignedid')})
                    };
                    fetch(('//127.0.0.1:5000/loadteamsforassignment'), requestOptions)
                    .then((res) => {return res.json()
                    .then((data) => {
                        var teams = []
                        for(var i = 0; i < data[0].length; i++){
                            for(var y = 0; y < data[1].length; y++){
                                if(data[0][i]['TeamID'] === data[1][y]['TeamsID']){
                                    teams.push({Team: data[0][i], TeamData: data[1][y]})
                                }
                            }
                        }
                        var myRows = []
                        for(const x of teams){
                            myRows.push({
                                teamid: x['Team']['TeamID'], 
                                teamname: x['TeamData']['TeamName'],
                                noofstudentscompleted: x['Team']['NoOfStudentsCompleted'],
                                noofstudentsassigned: x['Team']['NoOfStudentsAssigned'],
                                groupmark: x['TeamData']['GroupMark'],
                                groupgrade: x['TeamData']['GroupGrade']
                            })
                        }

                        secureStorage.removeItem('teamid');

                        setRows(myRows);
                        setMyAssessment(data[2])
                    });
                    });
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

    return(
        <div className="view-form-wrapper">
            <Helmet>
                {assessment.map((e, i) => {return <title>{e.AssessmentName}</title>})}
            </Helmet>
            <div className="header-wrapper">
                <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                <Button className="btn-home" onClick={() => window.location.replace('/lecturerhome')}>Home</Button>
                <Button className="btn-back" onClick={() => backHandle()}>Back</Button>
                <h2>Welcome { User.name }</h2>
            </div>
            <div className="form">
                <div className="datagrip-wrapper">
                <h4>Teams</h4>
                <Button className="export-grades" onClick={e => exportGrades(e)}>Export Grades</Button>
                <Button className="export-grades" onClick={e => emailGrades(e)}>Email Grades</Button>
                <Button className="export-grades" onClick={e => emailReminder(e)}>Email Reminder</Button>
                <Button className="export-grades" onClick={e => setComplete(e)}>Set To Complete</Button>
                    <div className="datagrid-styler" style={{height: 400, width:'80%'}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowId={(row) => row.teamid}
                            pageSize={100}
                            rowsPerPageOptions={[100]}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}