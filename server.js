var express = require('express'),
	app = express(),
	morgan = require('morgan');

app.set('port', process.env.PORT || 8080);	// set port
app.use(morgan('dev'));	// set request logging
app.use(express.static(__dirname + '/public'));	// serve static directory
app.get('*', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.listen(app.get('port'), function() {
	console.log('Running on port 8080..');
});