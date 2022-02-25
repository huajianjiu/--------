var express = require('express');
var router = express.Router();
var multer = require('multer');
var Return = require('../util/utils');
var fs = require("fs");

// 上传文件
router.post("/file", multer({
    dest: "./public/upload/"
}).single("file"), (req, res) => {
    var file = req.file;
    try {
        fs.renameSync(file.path, `./public/upload/${file.originalname}`)
        file.path = `../upload/${file.originalname}`;
        let size=file.size/1024;
        if (size<1024){
          size=size.toFixed(2)+"KB";
        }else if (size >= 1024&&size < 1024*1024) {
          size=size/1024;
          size=size.toFixed(2)+"MB";
        }else if (size >= 1024*1024&&size < 1024*1024*1024) {
          size=size/(1024*1024);
          size=size.toFixed(2)+"GB";
        }
        var json = Return.setResult();
        json.message = "上传成功";
        var data = {
            "url": file.path,
            "filename":file.originalname,
            "size":size,
            "type":file.originalname.split('.')[1]
        };
        json.data = data;
        res.send(json);
    } catch (e) {
        console.log(e)
        res.status(500).send({"message":"网络繁忙请稍后再试！"})
    }
})
module.exports = router;