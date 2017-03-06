/**
References
    https://expressjs.com/
    https://scotch.io/tutorials/use-expressjs-to-deliver-html-files
**/

const express = require("express");
const port = 1226;
const path = require("path");
var app = express();

app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(port, function(err) {
    if(err) {
        return console.log("Something went wrong", err);
    }

    console.log("Listening on port " + port);
});
