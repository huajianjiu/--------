var mysql = require("mysql");
var db = require("../config/db");
    var pool = mysql.createPool(db.config);
module.exports = {
    sqlConnect: function (sql, sqlArr, callback) {
        pool.getConnection(function (error, connection) {
            if (error) {
                console.log(error);
            }
            connection.query(sql, sqlArr,callback);
            // pool.releaseConnection(connection);
            connection.release();
            
        })
    },

}