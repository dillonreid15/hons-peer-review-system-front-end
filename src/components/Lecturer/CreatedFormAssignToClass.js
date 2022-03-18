import { UserData } from "../../azure/detectAuth";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { ListGroup } from "react-bootstrap";

export function CreatedFormAssignToClass(){
    const [listModules, setListModules] = useState([]);
    const [listModuleAssignments, setSelectedAssignments] = useState([]);
    const [mySubmit, setMySubmit] = useState([]);

    const User = UserData();

    const loadAssessmentsforModule = (value) => { 
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'text/html' },
            body: JSON.stringify({ ModuleID : String(value)})
        };
        fetch(('//127.0.0.1:5000/getassessmentsformodule'), requestOptions)
        .then((res) => {return res.json()
        .then((data) => {
            var MyAssessments = []
            data.forEach((x) => {
            var ObjectArray = Object.entries(x);
            MyAssessments.push(ObjectArray);                         
            });
            console.log("Modules Received");     
            setSelectedAssignments(MyAssessments); 
            setMySubmit([]);     
            console.log(MyAssessments)     
        });
        });       
    }

    const onSubmit = () => {
        //do next after make team
        localStorage.removeItem('')
    }

    const loadSubmit = () => {
        var sub =["sub"];
        setMySubmit(sub);
    }

    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
            if(localStorage.getItem('UserCheckComplete') === 'True'){
                if(!localStorage.getItem('formname') == null || !localStorage.getItem('formtype' == null))
                {
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
                        console.log(MyModules)     
                    });
                    });          
                }
                else{
                    window.location.replace('/createform')
                }
                
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
                <title>form - {localStorage.getItem("formname")} </title>
            </Helmet>
            <h1> Select Assessments to assign review form to </h1>
            <ListGroup className="modules">
                {listModules.map(function name(value, index){
                    return <ListGroup.Item action variant="primary" name={ value } key={ index } onClick={() => loadAssessmentsforModule(value[0][1])}>
                           {value[1][1]}
                            </ListGroup.Item>
                })}
            </ListGroup>
            <ListGroup className="assessmentsformodule">
                {listModuleAssignments.map(function name(value, index){
                    return <ListGroup.Item action variant="primary" name={ value } key={ index } onClick={() => loadSubmit()}>
                           {value[1][1]}
                            </ListGroup.Item>
                })}
            </ListGroup>
            <ListGroup className="loadsubmitbutton">
                {mySubmit.map(function name(value, index){
                    return <ListGroup.Item action variant="primary" name={ value } key={ index } onClick={() => onSubmit()}>
                           Submit
                            </ListGroup.Item>
                })}
            </ListGroup>
        </div>
        
    )
}