const mysql = require("mysql2");

const dbInfo = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'wjddbswjd75.',
    database: 'my_db'
};

module.exports = {
    init: function () {
        return mysql.createConnection(dbInfo);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql 연결 에러 : ' + err);
            else console.log('mysql 연결 성공');
        });
    }
};