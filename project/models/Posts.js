const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wjddbswjd75.',
    database: 'my_db',
    port: 3306
});

exports.selectAll = (data, cb) => {
    var sql = `SELECT * FROM post`;
    // const posts = await Post.findAll({ order: [["createdAt", "desc"]] });
    conn.query(sql, (err, rows) => {
        if (err) throw err;
        cb([{ id: 1, user_id: 1, content: 'content', createat: new Date(), updateat: new Date() }]);
    });
}

exports.findById = (data, cb) => {
    var sql = `SELECT * FROM post where id = ${data.postId}`;
    conn.query(sql, (err, rows) => {
        if (err) throw err;
        cb(rows[0]);
    });
}

exports.insertPost = (data, cb) => {
    const sql = `
        INSERT INTO my_db.post (id, user_id, title, content, createat, updateat) VALUES 
        (${data.id}, ${data.user_id}, '${data.title}', '${data.content}', NOW(), NOW());
    `;
    // const posts = await Post.findAll({ order: [["createdAt", "desc"]] });
    conn.query(sql, (err, rows) => {
        console.log(rows);
        if (err) throw err;
        cb(data);
    });
}

exports.updatePost = (data, cb) => {
    const sql = `
        UPDATE my_db.post 
        SET title = '${data.title}', content = '${data.content}', updateat = NOW() 
        WHERE id = ${data.postId};
    `;
    // const posts = await Post.findAll({ order: [["createdAt", "desc"]] });
    conn.query(sql, (err, rows) => {
        console.log(rows);
        if (err) throw err;
        cb(data);
    });
}

exports.deletePost = (data, cb) => {
    const sql = `
        DELETE FROM my_db.post 
        WHERE id = ${data.postId};
    `;
    // const posts = await Post.findAll({ order: [["createdAt", "desc"]] });
    conn.query(sql, (err, rows) => {
        console.log(rows);
        if (err) throw err;
        cb(data);
    });
}