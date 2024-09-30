
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser"); 
const cors = require('cors');

app.set("view engine", "ejs");
app.use( express.static( "uploads" ));
app.use(express.urlencoded({extended: true}));
app.use( bodyParser.json() );

const router = require("./routes");
app.use("/", router); 
app.use(cors);

app.listen(port, () => {
    console.log( "Server Port: ", port);
}) 