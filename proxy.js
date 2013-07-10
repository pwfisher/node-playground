/*global require */
require('http-proxy').createServer({
	hostnameOnly: true,
	router: {
		'app_1.com': '127.0.0.1:8081',
		'app_2.com': '127.0.0.1:8082'
	}
}).listen(8080);
