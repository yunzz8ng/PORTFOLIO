
require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const { sequelize } = require('./models/index');
const methodOverride = require('method-override')
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/post");
const likesRouter = require("./routes/likes");
const commentsRouter = require("./routes/comments");
const festivalRouter = require("./routes/festival");
const dibsRouter = require("./routes/dibs");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use("/", indexRouter);
app.use("/", postsRouter);
app.use("/", likesRouter);
app.use("/", commentsRouter);
app.use("/", festivalRouter);
app.use("/", dibsRouter);
app.use(cors);

const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('Database synchronized!');
        app.listen(parseInt(process.env.PORT), () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

startServer();