import { UserData } from "../azure/DetectAuth";

export function StudentHomeView(){
    const User = UserData();
    useEffect(() =>{
            if(User.isAuthenticated && User.IsUoD){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: JSON.stringify({ Email: String(User.email)})
                };
                /** Following fetch used to assign students teams, classes, and modules
                 *  if none exists for current user, this can be deleted before use in a production environment
                 */
                fetch(('//127.0.0.1:5000/checkforstudentdata'), requestOptions)
                .then((res) => {return res.json()
                .then((data) => {
                    console.log("User check complete");
                    
                });
                });
                fetch(('//127.0.0.1:5000/getliststudentforms'), requestOptions)
                .then((res) => {return res.json()
                .then((data) => {
                    console.log("Get form list complete");
                });
                });
                fetch(('//127.0.0.1:5000/getliststudentteamrequests'), requestOptions)
                .then((res) => {return res.json()
                .then((data) => {
                    console.log("Get form list complete");
                });
                });
            }
    }, []);
    return(
        <>
        <div className='background-image-wrapper'>
            <div className='signed-in-home-wrapper'>
            <Helmet>
            <title>Welcome { User.name } </title>
            </Helmet>
                <h1>Welcome  student { User.name } </h1>
                <SignOutButton/>
            </div>
        </div>
        </>
    );
}