var express = require('express');
var router = express.Router();

var express = require('express');
var router = express.Router();
var path = require('path');
const multer=require('multer');

router.use(express.static("public"));

const AES = require('./algorithm/AES');
const RSA = require('./algorithm/RSA');

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/encrypt',upload.array("file_to_encrypt",12),(req,res,next) => {
  console.log(req.body);
  // console.log(req);
  // console.log(req.body.content_key);
  const cutDirname = __dirname.split('\\');
  // console.log(cutDirname);
  const pathToReceiveFile = cutDirname[0] + "\\" + cutDirname[1]+"\\" + cutDirname[2] + "\\" + cutDirname[3] + "\\" + "encrypt_file" + "\\" ; // luu path client lay file

  for(var i = 0; i <req.files.length;i++){
    var filePath = handlePath(req.files[i].path);
    const key = req.body.content_key;
    filePath = path.join(__dirname,'./',filePath);
    if(req.body.algorithms == 'aes'){
      let k = new AES();
      k.encryptFile(filePath,key,pathToReceiveFile);
    }else{
      try {
        let q = new RSA();
        q.encryptedFile(filePath,pathToReceiveFile);
      } catch (error) {
        console.error(error.message);
      }

      // console.log(req.body.algorithms);
    }
    // const mypath = filePath;

  }
  
  res.send(pathToReceiveFile);
  // res.send("Hello");
});

router.post('/decrypt',upload.array("file_to_encrypt",12),(req,res,next) => {
  const cutDirname = __dirname.split('\\');
  // console.log(cutDirname);
  const pathToReceiveFile = cutDirname[0] + "\\" + cutDirname[1]+"\\" + cutDirname[2]  + "\\" + cutDirname[3] + "\\" + "decrypt_file" + "\\";
  // console.log(req.body.content_key);
  var get_mac_check_fail = [];

  for(var i = 0; i<req.files.length;i++){
    var filePath = handlePath(req.files[i].path);
    const key = req.body.content_key;
    filePath = path.join(__dirname,'./',filePath);
    if(req.body.algorithms == 'aes'){
      let k = new AES();
      // const mypath = filePath;
      const mac_check_fail = k.decryptFile(filePath,key,pathToReceiveFile);
      get_mac_check_fail.push(mac_check_fail);
    }

  }
  if(req.body.algorithms == 'aes'){
    var isFailed = get_mac_check_fail.filter((element) => {
      return !element;
    });
  
    if(isFailed.length < 1){
      res.send(pathToReceiveFile);
    }
    else{
      res.send("Mac check fail, please check your key or file!!!");
    }
  }

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
