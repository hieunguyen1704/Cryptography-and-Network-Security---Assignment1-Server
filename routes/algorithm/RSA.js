const NodeRSA = require('node-rsa');
const fs = require('fs');
const sha256 = require('sha256');
class RSA{
    constructor(key){
        this.key = key
    }
    encryptedFile = (filePath,pathToReceiveFile) =>{
        try {
            const keyEnc = new NodeRSA(this.key);
            const file = fs.readFileSync(filePath);
            const encryptedFile = keyEnc.encrypt(file);
            let arr_path = filePath.split('\\');
            let newPath = pathToReceiveFile + arr_path[arr_path.length-1]+".enc";
            console.log(newPath);
            fs.writeFileSync(newPath, encryptedFile);
        } catch (error) {
            return false;
        }
        return true;
    }
    decryptFile = (filePath,pathToReceiveFile) =>{
        try {
            const keyDec = new NodeRSA(this.key)
            const file = fs.readFileSync(filePath);
            const decryptFile = keyDec.decrypt(file);
            let arr_path = filePath.split('\\');
            let newPath = pathToReceiveFile + arr_path[arr_path.length-1];
            newPath = newPath.replace(/\.enc$/, '');
            fs.writeFileSync(newPath,decryptFile);
        } catch (error) {
            return false;
        }
        return true;
    }
}
module.exports = RSA;