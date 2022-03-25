/**Configuring microsoft authentication for login*/
export const msalConfig = {
    auth: {
        //id of azure application
        clientId: "cf73ac9a-b612-43d8-9a4f-191991ae3dc9",
        authority: "https://login.microsoftonline.com/organizations/",
        //application url
        redirectUri: "http://localhost:3000/login/.auth/login/aad/callback",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookieL: false,
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com"
};