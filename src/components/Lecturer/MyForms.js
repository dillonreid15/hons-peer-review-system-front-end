import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { UserData } from "../../azure/detectAuth";
import { Helmet } from "react-helmet";

export function MyForms(){
    const [listModules, setListModules] = useState([]);

    const User = UserData();
    
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
                    setListModules(MyModules);      
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
        <div>
            <Helmet>
                <title>My Forms</title>
            </Helmet>
            <h1>Yoink</h1>
            <ListGroup>
                {listModules.map(function name(value, index){
                    return <ListGroup.Item key={ index }>
                        <a>
                           {value[1][1]}
                        </a>
                    </ListGroup.Item>
                })}
            </ListGroup>
        </div>


        )

}