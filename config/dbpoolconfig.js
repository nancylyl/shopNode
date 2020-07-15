const mysql = require("mysql");

const dbpool = {
    pool: {},
    config: {
        host: "localhost",
        port: "3306",
        user: "root",
        password: "ROOT",
        database: "shopmanage",
        multipleStatements: true
    },
    create() {
        this.pool = mysql.createPool(this.config) //创建连接池
    },
    connect(sql, arr, fn) {
        this.pool.getConnection((err, connection) => {
            //console.log("connect:" + sql);
            connection.query(sql, arr, fn);
            connection.release();
        })
    },
    connectPage(sql, arr, pageCount, currentPage, fn) {
        this.pool.getConnection((err, connection) => {

            var start = (currentPage - 1) * pageCount;
            var newsql = 'select count(*) count from (' + sql + ') a;SELECT * FROM (' + sql + ')  a limit ' + start + ',' + pageCount + ';'
            connection.query(newsql, arr, fn);
            //    console.log(newsql);
            connection.release();
        })
    }


};
dbpool.create();
module.exports = dbpool;