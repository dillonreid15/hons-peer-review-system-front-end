import { AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";
import { AuthorizedComponent,UnauthorizedComponent } from "./UnauthorizedComponent";
import './Home.css';
import React from "react";



export function Home(){
    // const { instance, accounts } = useMsal();
    // const [graphData, setGraphData] = useState(null);
    // // const name = accounts[0] && accounts[0].name;
    // // const isUod = DetectIfUod();
    
    return (
        <>
        <div className='home-wrapper'>
        <AuthenticatedTemplate>
            <AuthorizedComponent/>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
            <UnauthorizedComponent/>
        </UnauthenticatedTemplate>
        </div>
        </>
        );
}


  