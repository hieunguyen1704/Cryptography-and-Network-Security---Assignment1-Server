const NodeRSA = require('node-rsa');
const fs = require('fs');
const sha256 = require('sha256');
class RSA{
    constructor(key){
        this.key = new NodeRSA(key);
        // this.public_key =  this.key.exportKey('public');
        // this.private_key = this.key.exportKey('private');
    }
    encryptedFile = (filePath,pathToReceiveFile) =>{
        const file = fs.readFileSync(filePath);
        // console.log(filePath);
        const encryptedFile = this.key.encrypt(file);
        let arr_path = filePath.split('\\');
        let newPath = pathToReceiveFile + arr_path[arr_path.length-1]+".enc";
        console.log(newPath);
        fs.writeFileSync(newPath, encryptedFile);
        return;
    }
    decryptFile = (filePath,pathToReceiveFile) =>{
        try {
            const file = fs.readFileSync(filePath);
            const decryptFile = this.key.decrypt(file);
            let arr_path = filePath.split('\\');
            let newPath = pathToReceiveFile + arr_path[arr_path.length-1];
            newPath = newPath.replace(/\.enc$/, '');
            // console.log(newPath);
            fs.writeFileSync(newPath,decryptFile);
        } catch (error) {
            return false;
        }
        return true;
    }
}
module.exports = RSA;