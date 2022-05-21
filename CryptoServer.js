const JSEncrypt = require('nodejs-jsencrypt').default;
const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const createOneTimePassword = () => {
    var result = [];
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

var genPass = createOneTimePassword()

const app = express()

// la problema
//const publicCheckKey = process.env.PUBLIC_KEY
const privateCheckKey = process.env.PRIVATE_KEY
const publicCheckKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBO71iVLEu7umehJ0HJ5501wW1rSKTL3hkng+WRJZCnQ/3ZWLJrdLdgRRkaQMpzdF+AmqvtioluXjZdyrhLpkRtcAkjgQbBnRnL5zirJydmYZJU8CRSjrrER439hHTD9Zml1y9Pa//NPcfnd9iw6kZSX5rArEzFiKp3hRZGgecYwIDAQAB"
// const privateCheckKey = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAME7vWJUsS7u6Z6EnQcnnnTXBbWtIpMveGSeD5ZElkKdD/dlYsmt0t2BFGRpAynN0X4Caq+2KiW5eNl3KuEumRG1wCSOBBsGdGcvnOKsnJ2ZhklTwJFKOusRHjf2EdMP1maXXL09r/809x+d32LDqRlJfmsCsTMWIqneFFkaB5xjAgMBAAECgYEAm4K/hI5SVkoyO7/QPDzXWoLd9ntTEw8mHhvSwYWLRCrw+ZJfsZ2x0VAboD+fKxqYGYhKYgUB4IBm0OUF3lnJF0CmzWYcPg7QpsNRU2iCp50c6EyGmNItpPQycnTx68xG1RTYE1EXfwAmHDeB9Bbsk87HHdJQqjANnUFeSDPq9/ECQQDelkKO7rZA/KNKmQJZIqGEGWvlMb+5SuHCiVRLT3vqKuaub0Fym1Ey6ngVYN5yZt2tnUV6brfwr+/y3TyQlq0pAkEA3j11Ju32DsAzC4dtmDM4vee8KY7OpnE2dkEGA9K6U8M/R3y3WQEtUC8kqf+m9EXOdiMlB72Ld0N0TojQ+R6iqwJAMcDShdJz6JjQAyeqb7Qe+EEabfOt0EQdrHc34VGV+CS4xXrW3UA8aS4hw12Qu2+k017ZHeHLucAJ2XZ8SDF16QJAE+woe2Proeji6o6qaXF2Dbgfaw5NQih1/GXZ1y/l2ipvmsX4Xbc4S67eN4seeVlkp7yAzk/Ul81pOL0VFrADXwJBAI/2Oq2AcSNOu6QY3JuzU4kN1mjKGDkBqmV3nHev9bp7NLyoasqzg8xo9lvuYjPpo47JXPgpH+CXXkLTTmqk/m8=";
app.use(express.json())
app.use(cors())

app.post('/getQRCodeData', (req,res) => {
    let message = createMessage(req.body.amount, req.body.cardNumber)
    res.json({qrCodeData: message})
})

app.post('/checkPass', (req,res) => {
    let message = checkPassword(req.body.pass)
    res.json({result: message})
})

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))

function createMessage(amount, cardNumber) {
    console.log(privateCheckKey)
    console.log(publicCheckKey)
    genPass = createOneTimePassword()

    const CryptoJS = require("crypto-js");

    let operationType = getOperationType()

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicCheckKey)

    const encryptedPass = encrypt.encrypt(genPass);

    const timeStamp = getTimeStamp()

    var message = cardNumber.slice(0,4)+ cardNumber.slice(-4)+
        " "+timeStamp+
        " "+amount+
        " "+operationType+
        " "+encryptedPass;

    var sign = new JSEncrypt();
    sign.setPrivateKey(privateCheckKey);

    var signature = sign.sign(message, CryptoJS.SHA256, "sha256");

    const qrCodeMessage = message + " " + signature

    return qrCodeMessage
}

function checkPassword(pass) {
    return pass === genPass
}


function getTimeStamp() {
    const currentDate = new Date();
    const date = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
    const time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

    return  date + "(" + time + ")";
}

function getOperationType() {
    switch (getRandomInt(1,5)) {
        case 1:
            return "bank_transfer"
        case 2:
            return "P2P_transfer"
        case 3:
            return "system_transfer"
        case 4:
            return "shop_purchase"
        default:
            return "bank_transfer"
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
