const fs = require('fs');
const sha256 = require('sha256');
const sha512 = require('js-sha512');
const md5 = require('md5');
const checkSum = (filePath , mode) =>{
    const contentFile = fs.readFileSync(filePath);
    let hashValue = "";
    if(mode === "sha256"){
        hashValue = sha256(contentFile);
    }else if(mode === "sha512"){
        hashValue = sha512(contentFile);
    }else{
        hashValue = md5(contentFile);
    }
    return hashValue;
}
module.exports = checkSum;