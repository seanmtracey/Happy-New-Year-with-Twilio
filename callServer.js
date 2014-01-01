var express = require('express'),
	app = express(),
	http = require('http'),
	fs = require('fs'),
	port = 5000;

var mysql = require('mysql'),
	connection = mysql.createConnection({
		host     : 'YOUR SQL HOST',
		user     : 'SQL USERNAME',
		password : 'SQL PW',
		database : 'YOUR PHONENUMBER DATABASE'
	});

app.listen(port);
app.use(express.bodyParser())

app.use(express.cookieParser());

app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
 });

console.log("Server started.\nAvailable on localhost:" + port);

var sid = "TWILIO SID",
	auth = "TWILIO AUTH TOKEN",
	client = require('twilio')(sid, auth);

//Trigger the phone calls by hitting this URL on your server
app.get('/make-the-calls', function(req, res){

	res.send("OK");

	makeTheCalls();

});

function makeTheCalls(){

	connection.query('SELECT * FROM telephones', function(err, data){

	for(var x = 0; x < data.length; x += 1){

		console.log(data[x].phonenumber);

		client.calls.create({
			url: "YOUR TWILIO XML",
			to: data[x].phonenumber,
			from: "YOUR TWILIO PHONE NUMBER",
			timeout: 30
		}, function(err, call) {
				console.log(call.sid);
		});	


	}


});

}
