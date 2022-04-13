import { useMsal } from "@azure/msal-react";
import { UserData } from "../../azure/detectAuth";
import React, { useEffect, useState } from "react";
import Helmet from 'react-helmet';
import SecureStorage from "secure-web-storage";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Popup from "react-popup";
import { TextField } from "@mui/material";

import './ViewTeam.css'
import { offset } from "dom-helpers";

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


export function ViewTeam(){
    const { instance } = useMsal();
    const User = UserData();

    const [teams, setTeams] = useState([]);
    const [students , setStudents] = useState([]);
    const [form, setForm] = useState([]);
    const [formStructure, setFormStructure] = useState([])
    const [rows, setRows] = useState([])
    const [appliedMark, setAppliedMark] = useState(0);
    const [appliedGrade, setAppliedGrade] = useState('F');
    const [lecAssessedIndividual, setLecAssessedIndividual] = useState([]);
    const [lecAssessedTeam, setLecAssessedTeam] = useState([]);
    const [numTeam, setNumTeam] = useState(0);

    const onChangeAppliedMark = (e) =>{
        let isnum = /^\d+$/.test(e.target.value)
        if(isnum){
            var num = parseInt(e.target.value);
            if(num > 100){
                let newAppliedMarks = appliedMark;
                newAppliedMarks = 100;
                setAppliedMark(newAppliedMarks);
                setAppliedGrade('A1');
            }
            else if(num < 0){
                let newAppliedMarks = appliedMark;
                newAppliedMarks = 0;
                setAppliedMark(newAppliedMarks);
                setAppliedGrade('F');
            }
            else{
                let newAppliedMarks = appliedMark;
                newAppliedMarks = parseInt(num);
                setAppliedMark(newAppliedMarks);
            }
            if(num > 89 && num < 100){
                setAppliedGrade('A1');
            }
            else if(num > 79 && num < 90){
                setAppliedGrade('A2');
            }
            else if(num > 69 && num < 80){
                setAppliedGrade('A3');
            }
            else if(num > 59 && num < 70){
                setAppliedGrade('B');
            }
            else if(num > 49 && num < 60){
                setAppliedGrade('C');
            }
            else if(num > 39 && num < 50){
                setAppliedGrade('D');
            }
            else if(num < 40){
                setAppliedGrade('F');
            }
        }
        else{
            
        }
    }

    const onChangeTeam = (e, i) => {
        let isnum = /^\d+$/.test(e.target.value)
        if(isnum){
            var num = parseInt(e.target.value);
            if(num > e.Weighting){
                let newTeam = [...lecAssessedTeam]
                newTeam[i]['Mark'] = e.Weighting
                setLecAssessedTeam(newTeam);
            }
            else if(num < e.Weighting){
                let newTeam = [...lecAssessedTeam]
                newTeam[i]['Mark'] = 0;
                setLecAssessedTeam(newTeam);
            }
            else{
                let newTeam = [...lecAssessedTeam]
                newTeam[i]['Mark'] = e.target.value
                setLecAssessedTeam(newTeam);
            }
        }
        else{

        }

    }

    const onChangeIndiv = (e, i, iS) => {
        let isnum = /^\d+$/.test(e.target.value)
        if(isnum){
            var num = parseInt(e.target.value);
            if(num > e.Weighting){
                let newTeam = [...lecAssessedIndividual]
                newTeam[i]['Student'][iS]['Mark'] = e.Weighting
                setLecAssessedIndividual(newTeam);
            }
            else if(num < e.Weighting){
                let newTeam = [...lecAssessedIndividual]
                newTeam[i]['Student'][iS]['Mark'] = 0;
                setLecAssessedIndividual(newTeam);
            }
            else{
                let newTeam = [...lecAssessedIndividual]
                newTeam[i]['Student'][iS]['Mark'] = num
                setLecAssessedIndividual(newTeam);
            }
        }
        else{
            
        }
    }

    const updateIndivGrade = (p, e) => {
        console.log(p.id)
        const mark = parseInt(e.target.value)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'text/html' },
            body: JSON.stringify({ Email: p.id, Mark: e.target.value, TeamID: secureStorage.getItem('teamid') })
        };
        fetch(('https://hons-peer-review-api.herokuapp.com/updateindiv'), requestOptions)
        .then((res) => {return res.json()
        .then((data) => {
            Popup.alert("Grade Updated");
        });
        });
    }

    const updateGrades = (e) =>{
        let toPushLecCats = []
        var catlist = []
        if(form[0]['SubmittedFormJSON'] != null){
            // add section to update if Lec already exists
            catlist = [...form[0]['SubmittedFormJSON']]
            var hasLec = false;
            for(var i = 0; i<catlist.length; i++){
                if(catlist[i].hasOwnProperty('Lec')){
                    hasLec = true;
                    for(const x of lecAssessedTeam){
                        let mark = parseInt(x['Mark'])
                        toPushLecCats.push({Category: x['Category'], Weighting: x['Weighting'], Mark: mark})
                    }
                    for(const x of lecAssessedIndividual){
                        toPushLecCats.push({Category: x['Category'], Weighting: x['Weighting'], Student: x['Student']})
                    }
                    if(toPushLecCats.length){
                        catlist[i]['Form'] = toPushLecCats;
                    }
                }  
            }
            if(!hasLec){
                for(const x of lecAssessedTeam){
                    toPushLecCats.push({Category: x['Category'], Weighting: x['Weighting'], Mark: x['Mark']})
                }
                for(const x of lecAssessedIndividual){
                    toPushLecCats.push({Category: x['Category'], Weighting: x['Weighting'], Student: x['Student']})
                }
                if(toPushLecCats.length){
                    catlist.push({Lec: User.email, Form: toPushLecCats})
                }
            }
        }
        else{
            catlist = []
            for(const x of lecAssessedTeam){
                toPushLecCats.push({Category: x['Category'], Weighting: x['Weighting'], Mark: x['Mark']})
            }
            for(const x of lecAssessedIndividual){
                toPushLecCats.push({Category: x['Category'], Weighting: x['Weighting'], Student: x['Student']})
            }
            if(toPushLecCats.length){
                catlist.push({Lec: User.email, Form: toPushLecCats})
            }
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ CatList: catlist, TeamID: secureStorage.getItem('teamid'), LecMark: appliedMark, LecGrade: appliedGrade})
        };
        fetch(('https://hons-peer-review-api.herokuapp.com/updategrades'), requestOptions)
        .then((res) => {return res.json()
        .then((data) => {
            window.location.reload(false);
        });
        });


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
                secureStorage.setItem('email', params.row.email)
                window.location.replace('/viewstudent');
            };
            return <Button onClick={onClick}>View Student</Button>;
          },
        },
        { field: 'email', headerName: 'Email', width: 400 },
        { field: 'modulatedMark', headerName: 'Modulated Mark', width: 150, editable: true },
        { field: 'modulatedGrade', headerName: 'Modulated Grade', width: 150}
    ]
   
    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
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
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'text/html' },
                            body: JSON.stringify({ TeamID: secureStorage.getItem('teamid')})
                        };
                        fetch(('https://hons-peer-review-api.herokuapp.com/getteamassignment'), requestOptions)
                        .then((res) => {return res.json()
                        .then((data) => {
                            var myRows = []
                            for(const x of data[1]){
                                myRows.push({
                                    email: x['Email'],
                                    modulatedMark: x['ModulatedMark'],
                                    modulatedGrade: x['ModulatedGrade']     
                                })
                            } 
                            var hasLec = false;
                            var colListLec = []
                            if(data[2][0]['SubmittedFormJSON'] != null){
                            for(const x of data[2][0]['SubmittedFormJSON']){
                                if(x.hasOwnProperty('Lec')){
                                    hasLec = true;
                                    colListLec.push(x)

                                }  
                            }
                            if(hasLec){
                                var listofLecAssessedTeam = []
                                var listofLecAssessedIndividual = []
                                for(const x of colListLec[0]['Form']){
                                    if(x.hasOwnProperty('Mark')){
                                        listofLecAssessedTeam.push({Category: x['Category'], Weighting: x['Weighting'], Mark: x['Mark']});
                                    }
                                    else if(x.hasOwnProperty('Student')){
                                        listofLecAssessedIndividual.push({Category: x['Category'], Weighting: x['Weighting'] , Student: x['Student']});
                                    }
                                }
                               setLecAssessedIndividual(listofLecAssessedIndividual)
                               setLecAssessedTeam(listofLecAssessedTeam)
                                
                            }
                            else{
                                var strucJson = JSON.parse(data[3][0]['CreatedFormJSON'])
                                var colList = strucJson['column-list']
                                var listofLecAssessedTeam = []
                                var listofLecAssessedIndividual = []
                                for(const x of colList){
                                    if(x['CategoryType'] === 'LecturerMarkedTeam'){
                                        listofLecAssessedTeam.push({Category: x['Category'], Weighting: x['Weighting'], Mark: 0});
                                    }
                                    else if(x['CategoryType'] === 'LecturerMarkedIndividual'){
                                        var studentTemp = []
                                        for(const y of data[1]){
                                            studentTemp.push({Email: y['Email'], Mark: 0})
                                        }
                                        listofLecAssessedIndividual.push({Category: x['Category'], Weighting: x['Weighting'] , Student: studentTemp});
                                    }
                                }
                                setLecAssessedIndividual(listofLecAssessedIndividual)
                                setLecAssessedTeam(listofLecAssessedTeam)
                            }
                        }
                        else{
                            var strucJson = JSON.parse(data[3][0]['CreatedFormJSON'])
                            var colList = strucJson['column-list']
                            var listofLecAssessedTeam = []
                            var listofLecAssessedIndividual = []
                            for(const x of colList){
                                if(x['CategoryType'] === 'LecturerMarkedTeam'){
                                    listofLecAssessedTeam.push({Category: x['Category'], Weighting: x['Weighting'], Mark: 0});
                                }
                                else if(x['CategoryType'] === 'LecturerMarkedIndividual'){
                                    var studentTemp = []
                                    for(const y of data[1]){
                                        studentTemp.push({Email: y['Email'], Mark: 0})
                                    }
                                    listofLecAssessedIndividual.push({Category: x['Category'], Weighting: x['Weighting'] , Student: studentTemp});
                                }
                            }
                            setLecAssessedIndividual(listofLecAssessedIndividual)
                            setLecAssessedTeam(listofLecAssessedTeam)

                        }



                            var noTeam = data[1].length;
                            setNumTeam(noTeam);
                            if(data[0][0]['GroupGrade'] != null){
                            setAppliedGrade(data[0][0]['GroupGrade']);
                            setAppliedMark(data[0][0]['GroupMark']);
                            }
                            setRows(myRows);
                            setTeams(data[0]);
                            setStudents(data[1]);
                            setForm(data[2]);
                            setFormStructure(data[3]);
                        });
                        });
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

    return(
        <>
        <div className="view-form-wrapper">
            <Helmet>
                {teams.map((e, i) => {return <title>{e.TeamName}</title>})}
            </Helmet>
            <div className='heading'>
                <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                <Button className="btn-home" onClick={() => window.location.replace('/lecturerhome')}>Home</Button>
                <Button className="btn-back" onClick={() => window.location.replace('/viewformlec')}>Back</Button>
            </div>
            <div className="form">
                <div className = "apply-grade">
                    <h2>Lecturer Assessed</h2>
                    <div className="lec-assessed-indiv-wrapper">
                        {lecAssessedIndividual.map((e, i) =>(
                            <div className = "indiv-wrapper">
                            <h3>Section: {e.Category}</h3>
                            <h3>Weighting: {e.Weighting}</h3>
                            {e['Student'].map((eS, iS) =>(
                                <div className='lec-assessed-team'>
                                    <h4>{eS.Email}</h4>
                                    <div className='mark-input'>
                                        <h4>Mark: </h4>
                                        <TextField
                                            id="outlined-number"
                                            type="number"
                                            sx={{width: '15ch'}}
                                            size = "small"
                                            margin= "none"
                                            InputProps={{ inputProps: {min: 0, max: e.Weighting}}}
                                            value={eS.Mark}
                                            onChange={e => onChangeIndiv(e, i, iS)}
                                        />
                                        <h4>/ {e.Weighting}</h4>
                                    </div>
                                </div>
                            ))}
                            </div>
                        ))}
                    </div>
                    <div className="lec-assessed-solo-wrapper">
                        {lecAssessedTeam.map((e, i) =>{
                            return(
                            <div className='lec-assessed-solo'>
                                <h3>Section: {e.Category}</h3>
                                <div className="mark-input">
                                    <h4>Mark: </h4>
                                    <TextField
                                        id="outlined-number"
                                        type="number"
                                        sx={{width: '15ch'}}
                                        size = "small"
                                        margin= "none"
                                        InputProps={{ inputProps: {min: 0, max: e.Weighting}}}
                                        value={e.Mark}
                                        onChange={e => onChangeTeam(e, i)}
                                    />
                                    <h4>/ {e.Weighting}</h4>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                    <div className = "apply-grade">
                        <h2>Apply Grade</h2>
                        <div className="grade-styler">
                            <h4>Mark: </h4>
                            <TextField
                                id="outlined-number"
                                type="number"
                                sx={{width: '15ch'}}
                                size = "small"
                                margin= "none"
                                InputProps={{ inputProps: {min: 0, max: 100}}}
                                value={appliedMark}
                                onChange={e => onChangeAppliedMark(e)}
                            />
                            <h4>Grade: {appliedGrade} </h4>
                            <Button className="update-grades" onClick={e => updateGrades(e)}>Update Grades</Button>
                        </div>
                    </div>
                    <div className="datagrid-wrapper">
                        <h2>Team Members</h2>
                        <div className="datagrid-styler" style={{height: 400, width: '80%'}}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                getRowId={(row) => row.email}
                                pageSize={100}
                                rowsPerPageOptions={[100]}
                                onCellEditStop={(params, event) => updateIndivGrade(params, event)}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
        </>
            )
}