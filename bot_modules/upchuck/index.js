var	https = require('https'),
	http = require('http'),
	util = require('util');

var hosts = [
	{ 'url' : "http://hostname/whatever",
	  'jid' : "jid@whatever" }
];

var HealthCheck = function(host, session) {

	var settings = {
		'session' : session,
		'hostname' : host.url,
		'windowSize' : 10,
		'interval' : 10000,
		'alertThreshold' : 50,
		'repeat' : 1800000,
		'jid' : host.jid
	};

	var	window = [],
		percent = 0,
		alerter = false;

	var pushWindow = function(result) {
		if(window.length >= settings.windowSize)
			window.shift();
		window.push(result);
	}

	var checkHealth = function() {
		var client = (settings.hostname.substr(0, 5) == "https") ? https : http;
		client.get(
			settings.hostname,
			function(response) {
				pushWindow(response.statusCode == 200);
				response.on(
					"error",
					function(err) {
						pushWindow(false);
					}
				);
			}
		).on(
			"error",
			function(err) {
				pushWindow(false);
			}
		);
	}

	var checkAlert = function() {
		if(window.length < settings.windowSize)
			return;
		var t = 0, f = 0;
		for(var w in window) {
			if(window[w])
				t++;
			else
				f++;
		}
		percent = (f / settings.windowSize) * 100;
		if(percent < settings.alertThreshold && !alerter) {
			return;
		} else if(percent < settings.alertThreshold) {
			clearInterval(alerter);
			alerter = false;
			session.say(
				settings.jid,
				settings.hostname + " has recovered."
			);
			return;
		}
		if(!alerter) {
			alerter = setInterval(doAlert, settings.repeat);
			doAlert();
		}
	}

	var doAlert = function() {
		session.say(
			settings.jid,
			util.format(
				"%s failed %s% of the last %s health checks.",
				settings.hostname, percent, settings.windowSize
			)
		);
	}

	setInterval(checkHealth, settings.interval);
	setInterval(checkAlert, settings.interval);

}

var botModule = function(session) {
	for(var h in hosts)
		new HealthCheck(hosts[h], session);
}

module.exports = botModule;
