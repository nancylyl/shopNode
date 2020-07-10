const mysql = require("mysql");

const dbpool = {
    pool: {},
    config: {
        host: "localhost",
        port: "3306",
        user: "root",
        password: "123456",
        database: "studentsystem"
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
    }

};
dbpool.create();
module.exports = dbpool;