const NodeRSA = require('node-rsa');
const fs = require('fs');
const sha256 = require('sha256');
class RSA{
    constructor(){
        this.key = new NodeRSA({b: 512});
        this.public_key =  this.key.exportKey('public');
        this.private_key = this.key.exportKey('private');
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
    decryptFile = (filePath) =>{
        const file = fs.readFileSync(filePath);
        const decryptFile = this.key.decrypt(file);
        fs.writeFileSync('../testRSA/decrypt.jpg',decryptFile);
        return;
    }
}
module.exports = RSA;