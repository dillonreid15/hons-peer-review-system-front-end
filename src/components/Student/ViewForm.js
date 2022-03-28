import { elementTypeAcceptingRef } from "@mui/utils";
import React, { useEffect, useState } from "react";
import Helmet from 'react-helmet';
import { UserData } from "../../azure/detectAuth";
import { Slider, SliderValueLabel } from "@mui/material";
import { Box } from "@mui/system";
import TextField from '@mui/material/TextField';
import Button from "react-bootstrap/Button";
import Popup from "react-popup";
import "./ViewForm.css"
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

export function ViewForm(){

    const [review, setReview] = useState([]);
    const [template, setTemplate] = useState([]);
    const [students, setStudents] = useState([]);
    const [catList, setCatList] = useState([]);
    const [visible, setVisibility] = useState(0);
    const [form, setForm] = useState([]);
    const [suggestedGrades, setSuggestedGrades] = useState([])
    const [catWeighting, setCatWeighting] = useState([]);
    const [defaultSlideVal, setDefaultSlideVal] = useState(0);

    const getVal = (i, val) =>{
        var sliderVal = 0;
        return sliderVal;
    }
    
    const setFormDefaults = (numCat, numStudent, myStudents, tempform) =>{
        var mark = 100 / numStudent;
        var student = [];
        var grade = [];
        for(var y=0; y<numStudent; y++){
            student.push({Email: myStudents[y]['Email'], SuggestedMark: mark, Comment: ""});
            grade.push({Student: myStudents[y]['Email'], Grade: 100});
        }
        for(let i=0; i<numCat; i++){
            setForm(form => [...form, {
                Category: tempform['column-list'][i]['Category'],
                Weighting: tempform['column-list'][i]['Weighting'],
                Student: student
              }])
        }
        setSuggestedGrades(grade);
    }

    const onChangeCatFields = (iCat, valCat, i, val)=>{
        let newFormValues = [...form];
        console.log(iCat, i, val.target.name, val.target.value);
        newFormValues[iCat]['Student'][i][val.target.name] = val.target.value
        newFormValues[iCat]['Student'][i]['Email'] = students[i]['Email'];
        newFormValues[iCat]['Category'] = valCat.Category
        newFormValues[iCat]['Weighting'] = valCat.Weighting
        var noOfCategories = 0;
        for(x of catList){
            noOfCategories++;
        }
        console.log(form);
        // if(val.target.name === 'SuggestedMark'){
        //     for(var y = 0; y < noOfCategories; y++){
        //         console.log(form[y]['Student'])
        //         // for(const x of form[y]){
        //         //     console.log("egg")
        //         // }
        //     }   
        //     // for(const x of newFormValues[newFormValues.length()]['Student'][i]['SuggestedMark']){
                
        //     // }
            
        // }
        for(var x of suggestedGrades){
            // console.log(newFormValues[iCat]['Student'][i][val.target.name]);
            // console.log(val.target.name);
        }

        setForm(newFormValues);
    }

    // const returnMax = (cat) =>{
    //     let formToRead = [...form];
    //     var catName = cat['Category'];
    //     var total = 100;
    //     for(var x of formToRead){
    //         if(x['Category'] === catName){
    //             var tempTotal = 0;
    //             for(var y of x['Student']){
    //                 tempTotal += y['SuggestedMark'];
    //             }
    //             total = tempTotal;
    //         }
    //     }
    //     return total;
    // }

    const handleSubmit = (e) =>{
        e.preventDefault();
        var efforts = true;
        var failedCat = [];
        for(var cat of form){   
            var total = 0;  
            for(var student of cat['Student']){
                total += student['SuggestedMark'];
            }
            console.log(total);
            if(total !== 100){
                efforts = false;
            }
        }
        if(efforts){
            var formToSend = JSON.stringify(form);
            console.log(suggestedGrades)
            // const requestOptions = {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ Form: formToSend})
            // };
            // fetch(('//127.0.0.1:5000/updatereview'), requestOptions)
            // .then((res) => {return res.json()
            // .then((data) => {
            //     localStorage.setItem("assignedid", data );
            //     localStorage.setItem("duedate", dtToFormat );
            //     localStorage.setItem("duetime", timeToFormat );
            //     console.log("File Uploaded"); 
            //     if(localStorage.getItem('formtype') === 'solo'){
            //         window.location.replace('/assignform')
            //     }    
            //     else if(localStorage.getItem('formtype') === 'team'){
            //         window.location.replace('/createteam')
            //     }
            // });
            // });       
        }
        else if(!efforts){
            console.log(failedCat);
            Popup.alert("Suggested Efforts must add up to 100% in each section");
            
        }          
    }   
 
    const effortsMark = [
        {
            value: 0,
            label: '0%',
        },
        {
            value: 25,
            label: '25%',
        },
        {
            value: 50,
            label: '50%',
        },
        {
            value: 75,
            label: '75%',
        },
        {
            value: 100,
            label: '100%',
        },
    ]

    const User = UserData();
    useEffect(() => {
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
            if(secureStorage.getItem('UserCheckComplete') === 'True'){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: JSON.stringify({ ReviewID : String(secureStorage.getItem('formid'))})
                };
                var reviewdata = [];
                var templatedata = [];
                var teamsdata = [];
                fetch(('//127.0.0.1:5000/loadform'), requestOptions)
                .then((res) => {return res.json()
                .then((data) => {
                    reviewdata = data[0];
                    templatedata = data[1];
                    teamsdata = data[2];

                    const datetimeReview = new Date(reviewdata[0]['DateDue']);
                    const currentDate = new Date()

                    var formtemp = JSON.parse(templatedata[0]['CreatedFormJSON']);
                    setCatList(formtemp['column-list']);
                    var noOfCat=0;
                    for(const x of formtemp['column-list']){
                        noOfCat++;
                    }
                    var noOfStudent=0;
                    for(const x of teamsdata){
                        noOfStudent++
                    }
                    const noToRound = (100 / noOfStudent)
                    var noToPas = Math.round(noToRound * 10) / 10;
                    setDefaultSlideVal(noToPas);
                    setFormDefaults(noOfCat, noOfStudent, teamsdata, formtemp);

                    if(datetimeReview > currentDate || reviewdata[0]['Visibility'] === 1){
                        setVisibility(1);
                    }
                    else if(datetimeReview < currentDate || reviewdata[0]['Visibility'] === 0){
                        setVisibility(0);
                    }

                    if(reviewdata[0]['SubmittedFormJSON'] === null){

                    }
                    else if(reviewdata[0]['SubmittedFormJSON'] !== null){

                    }


                    setReview(reviewdata);
                    setTemplate(templatedata);
                    setStudents(teamsdata);
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
        <>
        <div className="view-form-wrapper">
            <Helmet>
                <title>assessmentname</title>
            </Helmet>
            <div className='heading'>
                {review.map((e, i)=>{return <h2>Assessment: {e.ReviewName}</h2>})}
            </div>
            <div className='instruction-wrapper'>
                <div className='instruction'>
                    <div className='labels-wrapper'>
                        <label>Category: Section of the assignment</label>
                        <br/>
                        <label>Weighting:The percentage the section is worth in the overall assessment</label>
                        <br/>
                        <label>Percentage Slider:The percentage that the individual contributed to that session,
                            total % of the session must add up to 100%
                        </label>
                        <br/>
                        <label>Comment: Your own personal criticism or praise of an individuals work
                            during that section
                        </label>
                    </div>
                </div>
            </div>
            <div className='cat-wrapper'>
                {catList.map((elementCat, indexCat) =>{
                    return(
                        <>
                            <div className='inside-cat-wrapper' key={indexCat}>
                                <div className='headers'>
                                    <h4>Section: {elementCat.Category} {" "}</h4>
                                    <h4>Weighting: {elementCat.Weighting}%</h4>
                                    <h4>Total Percentage: {}%</h4>
                                </div>
                                <div className='student-wrapper'>
                                {students.map((element, index) => {
                                    return(
                                        <div className='inside-student-wrapper' key={index}>
                                            <label>{element.FullName}</label>
                                            <>
                                            <Box width={500}                                            >
                                                <Slider 
                                                    value={form[indexCat]['Student'][index]['SuggestedMark']}
                                                    defaultValue={defaultSlideVal}
                                                    aria-label={"Small"}
                                                    valueLabelDisplay="auto"
                                                    name="SuggestedMark"
                                                    marks = {effortsMark}
                                                    // max={returnMax(elementCat)}
                                                    onChange={e =>onChangeCatFields(indexCat, elementCat, index, e)}
                                                />
                                                <TextField
                                                    id="outlined-multiline-static"
                                                    placeholder="Comment..."
                                                    defaultValue={form[indexCat]['Student'][index]['Comment']}
                                                    multiline
                                                    rows={4}
                                                    sx={{width: 500}}
                                                    onChange={e =>onChangeCatFields(indexCat, elementCat, index, e)}
                                                    name="Comment"
                                                />
                                            </Box>
                                            </>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                        </>     
                    )
                })}
            </div>
            <div className="suggested-grades-wrapper">
                <div className='grades'>
                    <div className='labels-wrapper'>
                        <h4>Your Suggested % Of The Given Grade For Each Student</h4>
                        <br/>
                        <Button className='btn-submit' onClick={e => handleSubmit(e)}></Button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}