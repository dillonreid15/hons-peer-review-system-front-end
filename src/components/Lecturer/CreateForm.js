import { UserData } from "../../azure/detectAuth";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Button from "react-bootstrap/Button";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon";

export function CreateForm(){
    //store form states
    const [allValues, setAllValues] = useState({
        formname: 'My Form',
        formtype: 'team',
    });

    /** Datepicker passes a date object by default so can't pass an event
    * therefore have to store date in a seperate state
    */
    const [selectedDate, setDate] = useState(new Date());
    const [selectedTime, setTime] = useState(new Date());

    //store dynamically added categories
    const [catList, setCatList] = useState([{Category: "Whole Assignment", Weighting: "100"}])

    const User = UserData();

    const handleChange = (e) => {
        setAllValues({...allValues, [e.target.name]: e.target.value})
        console.log(allValues)
    }   

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
    }

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

        if(allValues.formname === "" || allValues.formtype === "" || catList.Category === "" || catList.Weighting === ""){
            alert("ALL FIELDS MUST HAVE VALUES")
        }
        else{
        var dtToFormat=DateTime.fromJSDate(selectedDate).toFormat('dd/MM/yyyy');
        var timeToFormat=DateTime.fromJSDate(selectedTime).toFormat('HH:mm');
        var formjson = {
             "email" : User.email,
             "name" : allValues.formname,
             "type" : allValues.formtype,
             "duedate" : dtToFormat,
             "duetime" : timeToFormat,
             "column-list" : catList
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
                console.log("File Uploaded");     
                
            });
            });            
            localStorage.setItem("formtype", allValues.formtype)
            localStorage.setItem("formname", allValues.formname)
            window.location.replace('/assignform')
        }
        console.log(formjson);
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
    }, [])

    return(
        <div>
            <Helmet>
                <title>Create Form</title>
            </Helmet>
            <div className="form">
                <form onSubmit={e => { handleSubmit(e) }}>
                    <label>
                        Form Name:
                        <input 
                            type="text"
                            name="formname"
                            value={allValues.formname}
                            onChange={e => {handleChange(e)}} 
                        />
                    </label>
                    <label>
                        Form Type:
                        <select
                            type="text"
                            name="formtype"
                            onChange={e=> {handleChange(e)}} 
                        >
                        <option value="team">Team Assignment</option>
                        <option value="solo">Solo Assignment</option>
                        </select>
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
                                <label>Category</label>
                                <input type="text" name="Category" value={element.Category || ""} onChange={e => handleChangeCatFields(index, e)} />
                                <label>Weighting</label>
                                <input type="text" name="Weighting" value={element.Weighting || ""} onChange={e => handleChangeCatFields(index, e)} />
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
