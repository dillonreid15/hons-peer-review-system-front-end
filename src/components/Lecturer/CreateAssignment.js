import { forwardRef, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { UserData } from "../../azure/detectAuth";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useTable } from "react-table";
import { Table } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid"



export function CreateAssignment(){
    const [myModules, setMyModules] = useState([]);
    const [assignedLecturers, setAssignedLecturers] = useState([]);
    const [lecturersForModule, setLecturersForModule] = useState([]);
    const [loadMyTable, setTable] = useState([]);
    const [rows, setRows] = useState([]);

    const [allValues, setAllValues] = useState({
        assignmentname: 'My Assignment',
        assignmenttype: 'team',
    });
    const User = UserData();

    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 200}
    ]    

    // const IntdeterminateCheckbox = forwardRef(
    //     ({indeterminate, ...rest}, ref) =>{
    //         const defaultRef = useRef()
    //         const resolvedRef = ref || defaultRef

    //         useEffect
    //     }
    // )



    const onSubmit = () => {

    }

    const handleChange = (e) => {
        setAllValues({...allValues, [e.target.name]: e.target.value})
        console.log(allValues)
    }   

    const getLecturersForModule = (value, e) => {
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
            setLecturersForModule(MyLecturers);
            setTable(['table']);
            console.log(MyLecturers);
            console.log("Lecturers received");   
            for (const x of MyLecturers){
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
    }, [])

    return(
        <div>
            <Helmet>
                <title>Create Assignment</title>
            </Helmet>
            <div className="form">
                <form onSubmit={e => { onSubmit(e) }}>
                    <label>
                        Assignment Name:
                        <input 
                            type="text"
                            name="assignmentname"
                            value={allValues.assignmentname}
                            onChange={e => {handleChange(e)}} 
                        />
                    </label>
                    <label>
                        Assignment Type:
                        <select
                            type="text"
                            name="assignmenttype"
                            onChange={e=> {handleChange(e)}} 
                        >
                        <option value="team">Team Assignment</option>
                        <option value="solo">Solo Assignment</option>
                        </select>
                    </label>
                    <ListGroup>
                        {myModules.map(function name(value, index){
                            return <ListGroup.Item action variant="primary" name={ value } key={ index } onClick={e => getLecturersForModule(value[0][1], e)}>
                                    {value[1][1]}
                                    </ListGroup.Item>
                        })}
                    </ListGroup>
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