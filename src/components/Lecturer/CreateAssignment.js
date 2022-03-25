import { useState } from "react";
import { Helmet } from "react-helmet";
import { UserData } from "../../azure/detectAuth";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid"
import Select from "react-select";
import Popup from "react-popup";

import './CreateAssignment.css'

export function CreateAssignment(){
    //list of modules for signed in user
    const [myModules, setMyModules] = useState([]);

    //store list of selected lecturers to be assigned to this assignment
    const [assignedLecturers, setAssignedLecturers] = useState([]);

    //store selected module id 
    const [selectedModuleID, setSelectedModuleID] = useState('');

    //used to load table and table rows
    const [loadMyTable, setTable] = useState([]);
    const [rows, setRows] = useState([]);

    //stores name and type of assignment
    const [allValues, setAllValues] = useState({
        assignmentname: 'My Assignment',
        assignmenttype: 'team',
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

        if(allValues.assignmentname === "" || allValues.assignmenttype === ""){
            Popup.alert("ALL FIELDS MUST HAVE VALUES")
        }
        else{
        //Creates json file to be uploaded for the created assignment 
        var formjson = {
             "assessmentname" : allValues.assignmentname,
             "assignmenttype" : allValues.assignmenttype,
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
                localStorage.setItem('formtype', allValues.assignmenttype);
                localStorage.setItem('formname', allValues.assignmentname);
                localStorage.setItem('assessmentid', data)
                window.location.replace('/createform');
            });
            });            
        }
        console.log(formjson);
    }

    //Handles change of assignment type
    const handleChange = (e) => {
        setAllValues({...allValues, [e.name]: e.value})
        // console.log(allValues)
    }   
    //Handles change of assignment name
    const handleChangeName = (e) => {
        setAllValues({...allValues, [e.target.name]: e.target.value})
        // console.log(allValues)
    }   

    //api call to get list of lecturers for selected assignment
    const getLecturersForModule = (value, e) => {
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
            // console.log(MyLecturers);
            console.log("Lecturers received");   
            for(const x of MyLecturers){
                var row = {name : x[1][1], email : x[0][1]}
                rowsToPush.push(row);
            }  
            setRows(rowsToPush);
            console.log(rowsToPush);
        });
        });    
    }

    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
            if(localStorage.getItem('UserCheckComplete') === 'True'){
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
                    console.log(MyModules)     
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
            <div className="form">
                <form onSubmit={e => { onSubmit(e) }}>
                    <label className="lbl-assignment-name">
                        Assignment Name: {" "}
                        <input 
                            type="text"
                            name="assignmentname"
                            onChange={e => {handleChangeName(e)}} 
                        />
                    </label>
                    <label className="lbl-assignment-type">
                        Assignment Type: {" "}
                        <Select
                            placeholder="Assignment Type"
                            className="select-type"
                            type="text"
                            name="assignmenttype"
                            options={[
                                {name: 'assignmenttype', value: 'team', label: 'Team Assignment'},
                                {name: 'assignmenttype', value: 'solo', label: 'Solo Assignment'}
                            ]}
                            onChange={handleChange} 
                        />
                    </label>
                    <ListGroup>
                        {/* dynamically load ListGroup Items for each module the user is assigned to */}
                        {myModules.map(function name(value, index){
                            return <ListGroup.Item action variant="primary" name={ value } key={ index } onClick={e => getLecturersForModule(value[0][1], e)}>
                                    {value[1][1]}
                                    </ListGroup.Item>
                        })}
                    </ListGroup>
                    {/* dynamically load table of lecturers once loadMyTable state has been updated */}
                    {loadMyTable.map(function table(value, index){
                        return( 
                            <div style={{height: 400, width: '100%'}}>
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
                                        console.log(assignedLecturers);
                                    }}
                                />
                            </div>
                    )})}
                    <Button className="btn-submit" type="submit">Create</Button>
                </form>
            </div>
        </div>
    )
}