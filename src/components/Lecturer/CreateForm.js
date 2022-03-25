import { UserData } from "../../azure/detectAuth";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Button from "react-bootstrap/Button";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon";
import './CreateForm.css'
import { Slider } from "@mui/material";
import { Box } from "@mui/system";
import MuiInput from '@mui/material/Input';
import Popup from "react-popup";

export function CreateForm(){
    /** Datepicker passes a date object by default so can't pass an event
    * therefore have to store date in a seperate state
    */
    const [selectedDate, setDate] = useState(new Date());
    const [selectedTime, setTime] = useState(new Date());

    //store dynamically added categories
    const [catList, setCatList] = useState([{Category: "Whole Assignment", Weighting: 50}])

    const User = UserData();

    const handleChangeDate = (date) =>{
        setDate(date)
    }

    const handleChangeTime = (time) =>{
        setTime(time)
    }

    const handleChangeCatFields = (i, e) => {

        let newFormValues = [...catList];
        newFormValues[i][e.target.name] = e.target.value;
        setCatList(newFormValues);
        catList.forEach(x => {
            console.log(x['Weighting']);
        })
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
        console.log(catListWeighting);
        var sum = catListWeighting.reduce((partialSum, a) => partialSum + a, 0);
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
                "name" : localStorage.getItem('formname'),
                "type" : localStorage.getItem('formtype'),
                "duedate" : dtToFormat,
                "duetime" : timeToFormat,
                "column-list" : catList,
                "assessmentid" : localStorage.getItem('assessmentid')
                };
                var formString = JSON.stringify(formjson)
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Form: formString})
                };
                fetch(('//127.0.0.1:5000/uploadform'), requestOptions)
                .then((res) => {return res.json()
                .then((data) => {
                    localStorage.setItem("assignedid", data );
                    localStorage.setItem("duedate", dtToFormat );
                    localStorage.setItem("duetime", timeToFormat );
                    console.log("File Uploaded"); 
                    if(localStorage.getItem('formtype') == 'solo'){
                        window.location.replace('/assignform')
                    }    
                    else if(localStorage.getItem('formtype') == 'team'){
                        window.location.replace('/createteam')
                    }
                });
                });            
            }
            console.log(formjson);
        }   
    }

    useEffect(() =>{
        if(User.IsUoD && User.isAuthenticated && (!User.IsStudent || User.email==="DJYReid@dundee.ac.uk")){
            if(localStorage.getItem('UserCheckComplete') === 'True'){
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
            <div className="form">
                <form onSubmit={e => { handleSubmit(e) }}>
                    <label>
                        Form Name: {localStorage.getItem('formname')}{" "}
                        {/* <input 
                            type="text"
                            name="formname"
                            value={allValues.formname}
                            onChange={e => {handleChange(e)}} 
                        /> */}
                    </label>
                    <label>
                        Form Type: {localStorage.getItem('formtype')}{" "}
                        {/* <select
                            type="text"
                            name="formtype"
                            onChange={e=> {handleChange(e)}} 
                        >
                        <option value="team">Team Assignment</option>
                        <option value="solo">Solo Assignment</option>
                        </select> */}
                    </label>
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
                    <label>
                        {catList.map((element, index) =>(
                            <div className="cat" key={index}>
                                <label>Category: </label>
                                <input type="text" name="Category" value={element.Category || ""} onChange={e => handleChangeCatFields(index, e)} />
                                <label>Weighting: </label>
                                <Box width={300}>
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
                                        step: 5,
                                        min: 0,
                                        max: 100,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                        }}
                                    />
                                </Box>
                                {/* <input type="text" name="Weighting" value={element.Weighting || ""} onChange={e => handleChangeCatFields(index, e)} /> */}
                                {
                                    index ?
                                        <button className="btn-remove" type="button" onClick={() => removeFormFields(index)}>Remove Category</button>
                                        : null
                                }
                            </div>
                        ))}
                    </label>

                    <Button className="btn-add" type="button" onClick={() => addFormFields()}>Add Category</Button>
                    <Button className="btn-submit" type="submit">Next</Button>
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
