var express = require('express');

var app = express();

var server = app.listen(3000, function() {
	console.log("App listening");
});

app.use(express.static(__dirname + '/js'));

app.use("/", function(req, res, next) {
	res.sendFile(__dirname + "/3jsTut.html");
});