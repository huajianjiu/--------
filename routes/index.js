var express = require('express');
const {
  sqlConnect
} = require('../sql/sqlUtil');
var router = express.Router();
var date = require("silly-datetime");
const {
  setResult
} = require("../util/utils");
var fs = require("fs");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect("index.html");
});
router.get('/index.html', function (req, res, next) {
  res.render('index', {})
});
// 查询文件列表
router.get('/filelist', function (req, res, next) {
  try {
    const page = req.query.page - 1.
    limit = req.query.limit * 1.
    let begin = page * limit;
    // 获取数据总数
    sqlConnect(`select count(1) as count from filelist where is_del=0`, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var count = data[0].count;
        var sql = `select * from filelist where is_del=0 order by 1 desc limit ?,?`;
        sqlConnect(sql, [begin, limit], (err, data) => {
          if (err) {
            console.log(err);
          } else {
            var json = setResult();
            json.code = 0;
            json.count = count;
            json.data = data;
            res.send(json);
          }
        })
      }
    })

  } catch (error) {
    console.log(error)
  }
});
// 上传文件
router.post("/", (req, res, next) => {
  const url = req.body.url,
    filename = req.body.filename,
    size = req.body.size,
    type = req.body.type,
    time = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  var sql = "insert into filelist (url,filename,size,type,date,is_del) values(?,?,?,?,?,0)";
  var sqlArr = [url, filename, size, type, time];
  sqlConnect(sql, sqlArr, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        "message": "网络繁忙请稍后再试！"
      })
    } else {
      var json = setResult();
      json.message = "添加成功";
      res.send(json);
    }
  })
})
// 删除文件
router.delete("/", function (req, res, next) {
  try {
    const data = req.body;
    var filename = data.filename;
    // 删除图片
    fs.unlink("./public/upload/" + filename, (err) => {
      if (err) {
        console.log(err);
      } else {
        sqlConnect(`delete from filelist where id=? `, data.id, (err, data) => {
          if (err) {
            res.send(setResult());
          } else {
            var json = setResult();
            json.msg = "删除成功";
            res.send(json);
          }
        })
      }
    });
    
  } catch (error) {
    console.log(error);
  }
})
module.exports = router;