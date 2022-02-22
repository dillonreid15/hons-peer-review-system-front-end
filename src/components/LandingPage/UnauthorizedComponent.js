import Helmet from 'react-helmet'; 
import { SignInButton } from "../azure/SignInButton";

export function UnauthorizedComponent(){
    return(
    <div className="unauthorized-wrapper">
        <Helmet>
            <title>Unregistered User</title>
        </Helmet>
        <div className="sign-in-wrapper">
            <h1>Please Sign in to access this application</h1>
            <SignInButton/>
        </div>
    </div>
    )
}