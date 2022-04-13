import SecureStorage from "secure-web-storage/secure-storage"

export function SecureStorageJS(){

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

}