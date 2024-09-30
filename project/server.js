var express = require('express');
var app = express();
var dbConfig = require(__dirname + '/lib/db.js');
var conn = dbConfig.init();

dbConfig.connect(conn);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
    res.send('메인');
});

app.get('/list', function (req, res) {
    var sql = 'SELECT * FROM user';
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('index.ejs', {list : rows});
    });
});

app.listen(3000, () => console.log('포트 3000번에서 시작'));