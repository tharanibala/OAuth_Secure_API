var express = require('express'),
	bodyParser = require('body-parser'),
	oauthserver = require('oauth2-server');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.oauth = oauthserver({
	model: require('./model.js'),
	grants: ['password', 'client_credentials'],
	debug: true
});

app.all('/oauth/token', app.oauth.grant());

//Resources
app.get('/profile', app.oauth.authorise(), function (req, res) {
	res.json({name:'tharaniya' ,date_of_birth:'14-08-1994' ,work :'student' , relationship: 'single'});
});

app.use(app.oauth.errorHandler());

app.listen(3000);
