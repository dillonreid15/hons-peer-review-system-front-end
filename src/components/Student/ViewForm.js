import React, { useEffect, useState } from "react";
import Helmet from 'react-helmet';
import { UserData } from "../../azure/detectAuth";
import { Slider } from "@mui/material";
import { Box } from "@mui/system";
import TextField from '@mui/material/TextField';
import Button from "react-bootstrap/Button";
import Popup from "react-popup";
import "./ViewForm.css"
import SecureStorage from "secure-web-storage/secure-storage"
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

export function ViewForm(){

    const { instance } = useMsal();

    const [review, setReview] = useState([]);
    const [students, setStudents] = useState([]);
    const [catList, setCatList] = useState([]);
    const [form, setForm] = useState([]);
    const [suggestedGrades, setSuggestedGrades] = useState([])
    const [catWeighting, setCatWeighting] = useState([]);
    const [defaultSlideVal, setDefaultSlideVal] = useState(0);
    const [numStudents, setNumStudents] = useState(0);
    const [additionalCatWeights, setAdditionalCatWeights] = useState(0);
    const [suggestedMark, setSuggestedMark] = useState([]);
    
    const setFormDefaults = (numCat, numStudent, myStudents, tempform) =>{
        var newForm = [];
        var catWeight = [];
        var suggestedMarks = [];
        for(let i=0; i<numCat; i++){
            newForm.push({ 
            Category: tempform['column-list'][i]['Category'], 
            Weighting: tempform['column-list'][i]['Weighting'],
            Student: []
            })
            catWeight.push({TotalPercentage: 100 })
            suggestedMarks.push({Category: tempform['column-list'][i]['Category'], 
                                 SuggestedMark: tempform['column-list'][i]['Weighting']})

        }
        for(let i=0; i<newForm.length; i++){
            for(let y=0; y<numStudent; y++){
                
                newForm[i]['Student'].push({Email : myStudents[y]['Email'],
                SuggestedMark: 100/numStudent,
                Comment: ""});

            }
        }
        for(var i=0; i<numStudent; i++){
            suggestedGrades.push({Email : myStudents[i]['Email'], FullName: myStudents[i]['FullName'], GradeAdjust: 100 })
        }
        setSuggestedMark(suggestedMarks);
        setNumStudents(numStudent);
        setCatWeighting(catWeight);
        setForm(newForm);
    }
    const loadFormDefaults = (form, numCat, numStudent, myStudents) =>{
        var newForm = [];
        var catWeight = [];
        var suggestedMarks = [];
        for(const x of form){
            if(x['Email'] === User.email){
                setSuggestedGrades(x['SuggestedGrades'])
                for(const y of x['Form']){
                    catWeight.push({TotalPercentage: 100 })
                    suggestedMarks.push({Category: y['Category'], SuggestedMark: y['SuggestedMark']})
                    newForm.push(y)
                    for(const j of y['Student']){
                    }
                }
            }
        }

        setSuggestedMark(suggestedMarks)
        setNumStudents(numStudent);
        setCatWeighting(catWeight);
        setForm(newForm);
    }

    /**When the suggested mark is updated for each category,
     * Check if the value is a valid number, then store it in the local state with the categories name
     *     **/
    const onChangeSuggestedMark = (iCat, e) =>{
        let isnum = /^\d+$/.test(e.target.value)
        if(isnum){
            let newSuggestedMarks = [...suggestedMark];
            newSuggestedMarks[iCat]['SuggestedMark'] = parseInt(e.target.value);
            setSuggestedMark(newSuggestedMarks);
        }
        else{
            
        }

    }

    const onChangeCatFields = (iCat, valCat, i, val)=>{
        let newFormValues = [...form];

        if(val.target.name === 'SuggestedMark'){
            var diff = Math.abs(newFormValues[iCat]['Student'][i]['SuggestedMark'] - val.target.value);
            if(newFormValues[iCat]['Student'][i]['SuggestedMark'] < val.target.value){   
                catWeighting[iCat]['TotalPercentage'] = catWeighting[iCat]['TotalPercentage'] + diff; 
            }
            else{
                catWeighting[iCat]['TotalPercentage'] = catWeighting[iCat]['TotalPercentage'] - diff;
            }
            
        }

        newFormValues[iCat]['Student'][i][val.target.name] = val.target.value;
        newFormValues[iCat]['Student'][i]['Email'] = students[i]['Email'];
        newFormValues[iCat]['Category'] = valCat.Category;
        newFormValues[iCat]['Weighting'] = valCat.Weighting;
        
        
        var suggestedPercentageArr = []
        for(var z=0; z<newFormValues.length; z++){
            var suggestedPercentage = ((newFormValues[z]['Weighting'] / 100) *
             (newFormValues[z]['Student'][i]['SuggestedMark'] * numStudents))
            suggestedPercentageArr.push(suggestedPercentage);
        }
        var total = 0;
        for(var j=0; j<suggestedPercentageArr.length; j++){
            total = total + suggestedPercentageArr[j];
        }
        var suggestedgradesArr = []
        for(const x of suggestedGrades){
            if(x['Email'] === newFormValues[iCat]['Student'][i]['Email']){
                x['GradeAdjust'] = total + additionalCatWeights;
            }
            suggestedgradesArr.push(x);
        }
        setSuggestedGrades(suggestedgradesArr);
        setForm(newFormValues);
    }

    //on form submit
    const handleSubmit = () =>{
        var efforts = true;
        //If any categories efforts don't add up to 100% show an alert to the user
        for(var cat of form){   
            var total = 0;  
            for(var student of cat['Student']){
                total += student['SuggestedMark'];
            }
            if(total !== 100){
                efforts = false;
            }
        }
        if(efforts){
            var formToSendWOutName = []
            //load form and add suggested marks for each categories
            for(var i = 0; i<form.length; i++){
                var toAdd = form[i];
                toAdd.SuggestedMark = suggestedMark[i]['SuggestedMark'];
                formToSendWOutName.push(toAdd);
            }
            var email = User.email
            //take form to submit and assign the signed-in users email address to it.
            var formToSendWithName = [{Email: email, Form: formToSendWOutName, SuggestedGrades: suggestedGrades}]
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ FormCat: formToSendWithName, ReviewID: review[0]['ReviewID']})
            };
            //As a review form entry is created on team assignment, we simply update the SubmittedForm column in the database,
            //so the following api call is made for both new forms and updating forms
            fetch(('//127.0.0.1:5000/studentupdateform'), requestOptions)
            .then((res) => {return res.json()
            .then((data) => {
               secureStorage.removeItem('formid');
               window.location.replace('/studenthome')
            });
            });       
        }
        else if(!efforts){
            Popup.alert("Suggested Efforts must add up to 100% in each section");
            
        }          
    }   
 
    //slider values
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
        //Commented out section is for testing purposes, allows users to access both sides of the system
        if(User.IsUoD && User.isAuthenticated /*&& (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")*/){
            if(secureStorage.getItem('UserCheckComplete') === 'True'){
                if(secureStorage.getItem('formid') !== ''){
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/html' },
                        body: JSON.stringify({ ReviewID : String(secureStorage.getItem('formid')), Email : String(User.email)})
                    };
                    var reviewdata = [];
                    var templatedata = [];
                    var teamsdata = [];
                    //get all data for review form
                    fetch(('//127.0.0.1:5000/loadform'), requestOptions)
                    .then((res) => {return res.json()
                    .then((data) => {
                        //review data is data stored on the teams review form
                        reviewdata = data[0];
                        //templatedata will store the template for the peer review form as submitted on creation by the lecturer
                        //includes categories and weighting
                        templatedata = data[1];
                        //stores data on the team the assessment was assigned to
                        teamsdata = data[2];
                        var formtemp = JSON.parse(templatedata[0]['CreatedFormJSON']);
                        var catlist = []
                        var noOfCat=0;
                        var additionalCat = 0;
                        //get list of categories from the form template

                            for(const x of formtemp['column-list']){
                                if(x['CategoryType'] === "TeamMarked"){
                                    catlist.push(x)
                                    noOfCat++;
                                }    
                                else{
                                    additionalCat = additionalCat + x['Weighting']
                                }
                            }        
                        setAdditionalCatWeights(additionalCat);
                        setCatList(catlist);
                        var noOfStudent=0;
                        for(var i = 0; i<teamsdata.length; i++){
                            noOfStudent++
                        }
                        //if there was no previously submitted form set empty form
                        if(reviewdata[0]['SubmittedFormJSON'] === null || reviewdata[0]['SubmittedFormJSON'].length === 0){
                            const noToRound = (100 / noOfStudent)
                            var noToPas = Math.round(noToRound * 10) / 10;
                            setDefaultSlideVal(noToPas);
                            setFormDefaults(noOfCat, noOfStudent, teamsdata, formtemp);
                        }
                        // if there was a previously submitted form load form values
                        else if(reviewdata[0]['SubmittedFormJSON'] !== null){
                            loadFormDefaults(reviewdata[0]['SubmittedFormJSON'], noOfCat, noOfStudent, teamsdata)
                        }

                        setReview(reviewdata);
                        setStudents(teamsdata);
                    });
                    });    
                }
            }
            else{
                window.location.replace('/studenthome')
            }
        }
        else{
            window.location.replace('/redirect')
        }
    // eslint-disable-next-line
    }, [])
    if(review.length){
        const datetimeReview = new Date(review[0]['DateDue'])
        const currentDate = new Date()
        if(review.length && review[0]['Visibility'] === 1 && datetimeReview > currentDate){
            return(
                <>
                <div className="view-form-wrapper">
                    <Helmet>
                        <title>assessmentname</title>
                    </Helmet>
                    <div className='heading'>
                        <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                        <Button className="btn-home" onClick={() => window.location.replace('/studenthome')}>Home</Button>
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
                        {catList.map((elementCat, indexCat) =>(
                                    <div className='inside-cat-wrapper' key={indexCat}>
                                        <div className='headers'>
                                            <h4>Section: {elementCat.Category} {" "}</h4>
                                            <h4>Weighting: {elementCat.Weighting}%</h4>
                                            <h4>Total Percentage: {catWeighting.length && catWeighting[indexCat]['TotalPercentage']}%</h4>
                                            <div className="suggested-mark">
                                            <h4>Suggested Mark: </h4>
                                                <TextField
                                                    id="outlined-number"
                                                    type="number"
                                                    sx={{width: '15ch'}}
                                                    size = "small"
                                                    margin= "none"
                                                    InputProps={{ inputProps: {min: 0, max: elementCat.Weighting}}}
                                                    value={suggestedMark[indexCat].SuggestedMark}
                                                    onChange={e =>onChangeSuggestedMark(indexCat, e)}
                                                />
                                            </div>
                                        </div>
                                        <div className='student-wrapper'>
                                        {students.map((element, index) => (
                                                <div className='inside-student-wrapper' key={index}>
                                                    <label>{element.FullName}</label>
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
                                                </div>
                                        ))}
                                        </div>
                                    </div>   
                        ))}

                    </div>
                    <div className="suggested-grades-wrapper">
                        <div className="submit-wrapper">
                            <Button type="submit" className="btn-submit" onClick={() => handleSubmit()}>Submit</Button>
                        </div>
                        <div className='grades'>
                            <div className='labels-wrapper'>
                                <h4>Your Suggested % Of The Given Grade For Each Student</h4>
                                <h4>Assuming 100% on non student marked categories</h4>
                                {suggestedGrades.map((element, index) =>{
                                    return(
                                        <div className='grade-name-wrapper'>
                                            <label>Name: {suggestedGrades[index]['FullName']} </label>
                                            <label>Suggestion: {suggestedGrades[index]['GradeAdjust']}%</label>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )
        }
        else{
            return(
                <>
                <div className="view-form-wrapper">
                    <Helmet>
                        <title>assessmentname</title>
                    </Helmet>
                    <div className='heading'>
                        <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                        <Button className="btn-home" onClick={() => window.location.replace('/studenthome')}>Home</Button>
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
                        {catList.map((elementCat, indexCat) =>(
                                    <div className='inside-cat-wrapper' key={indexCat}>
                                        <div className='headers'>
                                            <h4>Section: {elementCat.Category} {" "}</h4>
                                            <h4>Weighting: {elementCat.Weighting}%</h4>
                                            <h4>Total Percentage: {catWeighting.length && catWeighting[indexCat]['TotalPercentage']}%</h4>
                                            <div className="suggested-mark">
                                            <h4>Suggested Mark: </h4>
                                                <TextField
                                                    id="outlined-number"
                                                    type="number"
                                                    sx={{width: '15ch'}}
                                                    size = "small"
                                                    margin= "none"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='student-wrapper'>
                                        {students.map((element, index) => (
                                                <div className='inside-student-wrapper' key={index}>
                                                    <label>{element.FullName}</label>
                                                    <Box width={500}                                            >
                                                        <Slider 
                                                            value={form[indexCat]['Student'][index]['SuggestedMark']}
                                                            defaultValue={defaultSlideVal}
                                                            aria-label={"Small"}
                                                            valueLabelDisplay="auto"
                                                            name="SuggestedMark"
                                                            marks = {effortsMark}
                                                            // max={returnMax(elementCat)}
                                                            disabled
                                                        />
                                                        <TextField
                                                            id="outlined-multiline-static"
                                                            placeholder="Comment..."
                                                            defaultValue={form[indexCat]['Student'][index]['Comment']}
                                                            multiline
                                                            rows={4}
                                                            sx={{width: 500}}
                                                            name="Comment"
                                                            disabled
                                                        />
                                                    </Box>
                                                </div>
                                        ))}
                                        </div>
                                    </div>   
                        ))}
                    </div>
                    <div className="suggested-grades-wrapper">
                        <div className='grades'>
                            <div className='labels-wrapper'>
                                <h4>Your Suggested % Of The Given Grade For Each Student</h4>
                                {suggestedGrades.map((element, index) =>{
                                    return(
                                        <div className='grade-name-wrapper'>
                                            <label>Name: {suggestedGrades[index]['FullName']} </label>
                                            <label>Suggestion: {suggestedGrades[index]['GradeAdjust']}%</label>
                                        </div>
                                    )
                                })}
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )
        }
    }
    else{
        return(<h1>loading...</h1>)
    }
}