var express = require('express');
var router = express.Router();

var express = require('express');
var router = express.Router();
var path = require('path');
const multer=require('multer');
const {v1: uuid_v1} = require('uuid');

router.use(express.static("public"));

const AES = require('./algorithm/AES');
const RSA = require('./algorithm/RSA');
const checkSum = require('./checksum/checkSum');

//Cau hinh noi luu tru file sau khi tai len
var storage =multer.diskStorage({
  destination: (req,file,cb)=>{
      cb(null,'./routes/containfile')
  },
  filename: (req,file,cb)=>{
      cb(null,file.originalname)
  }
});
var upload= multer({storage:storage});

var hashStorage =multer.diskStorage({
  destination: (req,file,cb)=>{
      cb(null,'./routes/hash_containfile')
  },
  filename: (req,file,cb)=>{
      cb(null,uuid_v1() + file.originalname)
  }
});
var hashUpload= multer({storage:hashStorage});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/encrypt',upload.array("file_to_encrypt"),(req,res) => {
  const cutDirname = __dirname.split('\\');
  let pathToReceiveFile = cutDirname[0] + "\\" + cutDirname[1]+"\\" + cutDirname[2] + "\\" + cutDirname[3] + "\\" + "encrypt_file" + "\\" ; // luu path client lay file
  if (!pathToReceiveFile){
    pathToReceiveFile = cutDirname[0] + "\\" + cutDirname[1]+"\\";
  }
  for(var i = 0; i <req.files.length;i++){
    var filePath = handlePath(req.files[i].path);
    const key = req.body.content_key;
    filePath = path.join(__dirname,'./',filePath);
    if(req.body.algorithms == 'aes'){
      let k = new AES();
      k.encryptFile(filePath,key,pathToReceiveFile);
    }else{
      try {
        let q = new RSA(key);
        isNotError = q.encryptedFile(filePath,pathToReceiveFile);
        console.log(isNotError);
        if(!isNotError){
          res.send("Something went wrong, please check your key or your files.");
          return;
        }
      } catch (error) {
        console.error(error.message);
        return;
      }
    }
  }
  res.send(pathToReceiveFile);
  // res.send("Hello");
});

router.post('/decrypt',upload.array("file_to_encrypt"),(req,res) => {
  const cutDirname = __dirname.split('\\');
  // console.log(cutDirname);
  let pathToReceiveFile = cutDirname[0] + "\\" + cutDirname[1]+"\\" + cutDirname[2]  + "\\" + cutDirname[3] + "\\" + "decrypt_file" + "\\";
  if (!pathToReceiveFile){
    pathToReceiveFile = cutDirname[0] + "\\" + cutDirname[1]+"\\";
  }
  // console.log(req.body.content_key);
  var get_mac_check_fail = [];

  for(var i = 0; i<req.files.length;i++){
    var filePath = handlePath(req.files[i].path);
    const key = req.body.content_key;
    filePath = path.join(__dirname,'./',filePath);
    // console.log(req.body);
    if(req.body.algorithms == 'aes'){
      let k = new AES();
      // const mypath = filePath;
      const mac_check_fail = k.decryptFile(filePath,key,pathToReceiveFile);
      get_mac_check_fail.push(mac_check_fail);
    }
    else{ //rsa
        let q = new RSA(key);
        const mac_check_fail = q.decryptFile(filePath, pathToReceiveFile);
        get_mac_check_fail.push(mac_check_fail);

    }
  }
    var isFailed = get_mac_check_fail.filter((element) => {
      return !element;
    });
    if(isFailed.length < 1){
      res.send(pathToReceiveFile);
    }
    else{
      res.send("Something went wrong, please check your key or your files.");
    }
});

router.post('/check', hashUpload.array("file_check"), (req,res) =>{
  // console.log(req.files);
  const mode_hash = req.body.mode_hash;
  var arrHash = []
  for(var i = 0; i<req.files.length;i++){
    var filePath = handlePath(req.files[i].path);
    filePath = path.join(__dirname,'./',filePath);
    arrHash.push(checkSum(filePath, mode_hash));
  }
  var compareResult = false;
  if(arrHash[0] === arrHash[1]){
    compareResult = true
  }
  const sendData = {
    hashValue: arrHash,
    compareResult: compareResult
  }
  res.send(sendData);
});

module.exports = router;

const handlePath = (path) => {
  var newPath = path.split('\\');
  var result = "";
  for(var i = 1 ; i < newPath.length -1; i++){
    result += newPath[i] + "/";
  }
  result += newPath[newPath.length - 1];
  return result;
}
