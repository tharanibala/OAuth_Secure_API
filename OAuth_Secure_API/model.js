/**
 * Configuration.
 */

var config = {
	
	//To be used for Resource Owner Password Credentials Grant Type 
	clients: [{
		clientId: 'user_client',
		clientSecret: 'pass_client'
	}],
	
	//To be used for Client Credentials Grant Type
	confidentialClients: [{
		clientId: 'user_trusted_client',
		clientSecret: 'pass_trusted_client'
	}],
	tokens: [],
	
	//Resource Owners
	users: [{
		username: 'user_tharani',
		password: 'pass_tharani'
	}]
};

/**
 * Dump the memory storage content (for debug).
 */

var dump = function() {

	console.log('clients', config.clients);
	console.log('confidentialClients', config.confidentialClients);
	console.log('tokens', config.tokens);
	console.log('users', config.users);
};

/*
 * Methods used by all grant types.
 */

var getAccessToken = function(bearerToken, callback) {

	var tokens = config.tokens.filter(function(token) {

		return token.accessToken === bearerToken;
	});

	return callback(false, tokens[0]);
};

var getClient = function(clientId, clientSecret, callback) {

	var clients = config.clients.filter(function(client) {

		return client.clientId === clientId && client.clientSecret === clientSecret;
	});

	var confidentialClients = config.confidentialClients.filter(function(client) {

		return client.clientId === clientId && client.clientSecret === clientSecret;
	});

	callback(false, clients[0] || confidentialClients[0]);
};

var grantTypeAllowed = function(clientId, grantType, callback) {

	var clientsSource,
		clients = [];

	if (grantType === 'password') {
		clientsSource = config.clients;
	} else if (grantType === 'client_credentials') {
		clientsSource = config.confidentialClients;
	}

	if (!!clientsSource) {
		clients = clientsSource.filter(function(client) {

			return client.clientId === clientId;
		});
	}

	callback(false, clients.length);
};

var saveAccessToken = function(accessToken, clientId, expires, user, callback) {

	config.tokens.push({
		accessToken: accessToken,
		expires: expires,
		clientId: clientId,
		user: user
	});

	callback(false);
};

/*
 * Method used only by password grant type.
 */

var getUser = function(username, password, callback) {

	var users = config.users.filter(function(user) {

		return user.username === username && user.password === password;
	});

	callback(false, users[0]);
};

/*
 * Method used only by client_credentials grant type.
 */

var getUserFromClient = function(clientId, clientSecret, callback) {

	var clients = config.confidentialClients.filter(function(client) {

		return client.clientId === clientId && client.clientSecret === clientSecret;
	});

	var user;

	if (clients.length) {
		user = {
			username: clientId
		};
	}

	callback(false, user);
};

/**
 * Export model definition object.
 */

module.exports = {
	getAccessToken: getAccessToken,
	getClient: getClient,
	grantTypeAllowed: grantTypeAllowed,
	saveAccessToken: saveAccessToken,
	getUser: getUser,
	getUserFromClient: getUserFromClient
};
