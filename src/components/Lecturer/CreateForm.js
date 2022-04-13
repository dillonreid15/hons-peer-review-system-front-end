import { UserData } from "../../azure/detectAuth";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Button from "@mui/material/Button";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon";
import './CreateForm.css'
import { Slider } from "@mui/material";
import { Box } from "@mui/system";
import MuiInput from '@mui/material/Input';
import Popup from "react-popup";
import { useMsal } from "@azure/msal-react";
import SecureStorage from "secure-web-storage/secure-storage"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

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

export function CreateForm(){
    /** Datepicker passes a date object by default so can't pass an event
    * therefore have to store date in a seperate state
    */
    const [selectedDate, setDate] = useState(new Date());
    const [selectedTime, setTime] = useState(new Date());

    //store dynamically added categories
    const [catList, setCatList] = useState([{Category: "Whole Assignment", Weighting: 50, CategoryType: "TeamMarked"}])

    const User = UserData();
    const { instance } = useMsal();


    const handleChangeDate = (date) =>{
        setDate(date)
    }

    const handleChangeTime = (time) =>{
        setTime(time)
    }

    const handleChangeCatFields = (i, e) => {

        let newFormValues = [...catList];
        newFormValues[i][e.target.name] = e.target.value;
        console.log(newFormValues)
        setCatList(newFormValues);
    
    }


    const handleBlur = (i, e) => {
        if (catList[i].Weighting < 0) {
            setCatList[i].Weighting(0);
        } else if (catList[i].Weighting > 100) {
            setCatList[i].Weighting(100);
        }
      };

    const addFormFields = () => {
        setCatList([...catList, { Category: "", Weighting: "" }])
    }
    const removeFormFields = (i) => {
        let newFormValues = [...catList];
        newFormValues.splice(i, 1);
        setCatList(newFormValues);
    }
    const handleSubmit = (e) => {
        // this will create json from entries and then send it to the database
        e.preventDefault();

        let catListWeighting = [];
        catList.forEach(x => {
            catListWeighting.push(x['Weighting'])
        })
        var isValidName = true;
        var isValidType = true;
        for(const x of catList){
            
            if(x['Category'] === '' || (x['Category']).trim().length === 0){
                isValidName = false;
            } 
            if(x['CategoryType'] === ''){
                isValidType = false;
            } 
        }
        if(isValidName){
            if(isValidType){
                var arrToInt = catListWeighting.map(function(x) {
                    return parseInt(x, 10);
                });
                var sum = arrToInt.reduce((partialSum, a) => partialSum + a, 0);
                if(sum !== 100){
                    Popup.alert('Weighting must add up to 100');
                }
                else if (sum === 100){
                    if(catList.Category === "" || catList.Weighting === ""){
                        Popup.alert("ALL FIELDS MUST HAVE VALUES")
                    }
                    else{
                    var dtToFormat=DateTime.fromJSDate(selectedDate).toFormat('dd/MM/yyyy');
                    var timeToFormat=DateTime.fromJSDate(selectedTime).toFormat('HH:mm');
                    var formjson = {
                        "email" : User.email,
                        "name" : secureStorage.getItem('formname'),
                        "duedate" : dtToFormat,
                        "duetime" : timeToFormat,
                        "column-list" : catList,
                        "assessmentid" : secureStorage.getItem('assessmentid')
                        };
                        var formString = JSON.stringify(formjson)
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ Form: formString})
                        };
                        if(secureStorage.getItem('assignedid') === null){
                            fetch(('//127.0.0.1:5000/uploadform'), requestOptions)
                            .then((res) => {return res.json()
                            .then((data) => {
                                secureStorage.setItem("assignedid", data );
                                secureStorage.setItem("duedate", dtToFormat );
                                secureStorage.setItem("duetime", timeToFormat );
                                console.log("File Uploaded"); 
                                window.location.replace('/createteam');
                            }); 
                            });
                        }
                        else{
                            fetch(('//127.0.0.1:5000/updateform'), requestOptions)
                            .then((res) => {return res.json()
                            .then((data) => {
                                secureStorage.setItem("duedate", dtToFormat );
                                secureStorage.setItem("duetime", timeToFormat );
                                window.location.replace('/createteam')
                                
                            });
                            });
                        }            
                    }
                }  
            }
            else
            {
                Popup.alert("Please select a category type")
            }
        }
        else
        {
            Popup.alert("Please enter a name for all categories")
        } 
        
    }

    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
            if(secureStorage.getItem('UserCheckComplete') === 'True'){
                console.log(secureStorage.getItem('assignedid'));
                if(secureStorage.getItem('assignedid') !== null){
                    //If form was already created but no teams were assigned, reload the form to make changes
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/html' },
                        body: JSON.stringify({ AssignedID : String(secureStorage.getItem('assignedid')) })
                    };
                    fetch(('//127.0.0.1:5000/loadunsubmittedform'), requestOptions)
                    .then((res) => {return res.json()
                    .then((data) => {
                        const jsonObj = JSON.parse(data[0]['CreatedFormJSON']);
                        const time = jsonObj['duetime']; 
                        const date = jsonObj['duedate'];
                        const cTime = new Date(Date.prototype.setHours.apply(new Date(), time.split(':')));
                        const cDate = new Date(Date.prototype.setDate.apply(new Date(), date.split('/')));
                        setDate(cDate);
                        setTime(cTime);
                        const Cat = jsonObj['column-list'];
                        setCatList(Cat);
                        console.log(Cat);
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
        <div className="create-form-wrapper">
            <Helmet>
                <title>Create Form</title>
            </Helmet>
            <div className="header-wrapper">
                <Button className="btn-logout" onClick={() => handleLogout(instance)}>Logout</Button>
                <Button className="btn-home" onClick={() => window.location.replace('/lecturerhome')}>Home</Button>
                <Button className="btn-back" onClick={() => window.location.replace('/createassignment')}>Back</Button>
                <h2>Form Name: {secureStorage.getItem('formname')} </h2>
            </div>
            <div className="form">
                <form onSubmit={e => { handleSubmit(e) }}>
                    <div className ="non-dynamic-elements-wrapper">
                        <label>
                            Due Date:
                            <ReactDatePicker
                                selected={selectedDate}
                                dateFormat="dd/MM/yyyy"
                                onChange={handleChangeDate}
                            />
                        </label>
                        <label>
                            Time:
                            <ReactDatePicker
                                selected={selectedTime}
                                dateFormat="HH:mm"
                                onChange={handleChangeTime}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                            />
                        </label>
                    </div>
                    <div className="cat-wrapper">
                        {catList.map((element, index) =>(
                            <div className="inside-cat-wrapper" key={index}>
                                <Box width={300}>
                                <label>Category: </label>
                                <br/>
                                <input type="text" name="Category" value={element.Category || ""} onChange={e => handleChangeCatFields(index, e)} />
                                <br/>
                                <label>Weighting: </label>
                                <br/>
                                    <Slider 
                                        defaultValue={50}
                                        value={catList[index].Weighting}
                                        aria-label={"Small"}
                                        valueLabelDisplay="auto"
                                        name="Weighting"
                                        onChange={e =>handleChangeCatFields(index, e)}
                                    />
                                    <MuiInput
                                        value={catList[index].Weighting}
                                        size="small"
                                        name="Weighting"
                                        onChange={e => handleChangeCatFields(index, e)}
                                        onBlur={e => handleBlur(index, e)}
                                        inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 100,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                        }}
                                    />
                                </Box>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Category Type</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="CategoryType"
                                        defaultValue="TeamMarked"
                                        onChange={e => handleChangeCatFields(index, e)}
                                    >
                                        <FormControlLabel  value="TeamMarked" control={<Radio />} label="Team Marked" />
                                        <FormControlLabel value="LecturerMarkedTeam" control={<Radio />} label="Lecturer Marked - Team" />
                                        <FormControlLabel value="LecturerMarkedIndividual" control={<Radio />} label="Lecturer Marked - Solo" />
                                    </RadioGroup>
                                </FormControl>
                                <div className="btn-remove-wrapper">
                                    {
                                        index ?
                                            <Button className="btn-remove" onClick={() => removeFormFields(index)}>Remove Category</Button>
                                            : null
                                    }
                                </div>
                            </div> 
                        ))}
                    </div>
                    <div className="submit-wrapper">                
                        <Button className="btn-add" type="button" onClick={() => addFormFields()}>Add Category</Button>
                        <Button className="btn-submit" type="submit">Next</Button>
                    </div>    
                </form>
            </div>
        </div>
    )
}

/** Select wether or not it's an individual project from dropdown or radio 
    Enter name for form --- DONE 
    Select Due Date for form
    Add column button =>
        Enter name for column. i.e section of assessment
        Add weighting
        Delete Column Button

    ----------  NEXT PAGE   ----------

    SELECT MODULE FROM DROP DOWN 
    SELECT LIST OF CLASSES TO ASSIGN FORM TO

    SELECT APPLY
*/
