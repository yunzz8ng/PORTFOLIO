
const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const cors = require('cors');
const { sequelize, User, Post, Comment, Likes } = require('./models/index');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const indexRouter = require("./routes/index");
const postsRouter = require("./routes/post");
const likesRouter = require("./routes/likes");
const commentsRouter = require("./routes/comments");
app.use("/", indexRouter);
app.use("/", postsRouter);
app.use("/", likesRouter);
app.use("/", commentsRouter);
app.use(cors);


const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('Database synchronized!');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

startServer();