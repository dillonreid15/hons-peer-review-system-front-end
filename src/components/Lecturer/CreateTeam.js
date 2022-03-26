import { Helmet } from "react-helmet";
import { UserData } from "../../azure/detectAuth";
import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import './CreateTeam.css'

export function CreateTeam(){
    const User = UserData();
    const [listOfUsers, setListOfUsers] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [rowsTeam, setRowsTeam] = useState([])
    const [listOfTeamNames, setListOfTeamNames] = useState([])
    const [rows, setRows] = useState([]);
    const columns = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'email', headerName: 'Email', width: 500}
    ]    

    const handleCreateTeams = () => { 
        const teamname = prompt('Please enter a team name');

        var lstUser = listOfUsers;
        lstUser = lstUser.filter((el) => !selectedStudents.includes(el));
        setListOfUsers(lstUser);
        console.log(lstUser);
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

    const rowsLoad = (x) => {
        var listOfStudentWithTeamName = []
        for(const y of rowsTeam){
            if(x == y['teamname']){
                listOfStudentWithTeamName.push(y)
            }
        }
        return listOfStudentWithTeamName;
    }

    const onSubmit = () => {
        var form = {
            "AssignedID" : localStorage.getItem('assignedid'),
            "AssessmentID": localStorage.getItem('assessmentid'),
            "DueDate": localStorage.getItem('duedate'),
            "DueTime": localStorage.getItem('duetime'),
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
            localStorage.removeItem('assignedid');
            localStorage.removeItem('formname');
            localStorage.removeItem('formtype');
            localStorage.removeItem('assessmentid');
            localStorage.removeItem('duedate');
            localStorage.removeItem('duetime');
            console.log("File Uploaded");     
            window.location.replace('/lecturerhome')
        });
        });
    }

    const columnsForTeam = [
        { field: 'teamname', headerName: 'Team Name', width: 250 },
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'email', headerName: 'Email', width: 500}
    ]    
    // const loadTeamsForAssessment = (value) => { 
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'text/html' },
    //         body: JSON.stringify({ AssessmentID : String(value)})
    //     };
    //     fetch(('//127.0.0.1:5000/getteamsforassessment'), requestOptions)
    //     .then((res) => {return res.json()
    //     .then((data) => {
    //         var MyTeams = []
    //         data.forEach((x) => {
    //         var ObjectArray = Object.entries(x);
    //         MyTeams.push(ObjectArray);                         
    //         });
    //         console.log("Modules Received");     
    //         setListOfTeams(MyTeams); 
    //         // setMySubmit([]);     
    //         console.log(MyTeams)     
    //     });
    //     });       
    // }

    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
            if(localStorage.getItem('UserCheckComplete') === 'True'){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: JSON.stringify({ AssessmentID : String(localStorage.getItem('assessmentid'))})
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
            <h3> Assign Teams to Assessments </h3>
            <h4>{localStorage.getItem('formname')}</h4>
            <div className="datagrid-wrapper-1">
                <div style={{height: 400, width: '50%'}}>
                    {console.log(rows)}
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
                    <div style={{height: 400, width: '50%'}}>
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
                                // setSelectedStudents(selectedRowData)
                                // console.log(selectedStudents)
                                // setAssignedLecturers(selectedRowData);
                                // console.log(assignedLecturers);
                            }}
                        />
                    </div>
                )
            })}
        </div>
    )
}


/* 
Have one table with a list of existing teams with their students
A second table that has a list of students for the classes 

AFTER DINNER SORT OUT HOW THIS WILL WORK WITH CLASSES I KINDA FORGOT ABOUT THAT OOPSIEEEEE

ALSO FINISH API CALL, IT DOESN't ACTUALLY GET ANY TEAMS OR ANYTHING OOPSIEEEE
*/