var Session = require("./Session.js"),
	util = require("util"),
	events = require("events");

var Bot = function() {
	
	var properties = {
		'name' : "",
		'status' : ""
	};

	var sessions = [];

	this.addSession = function(options) {
		var session = new Session(options.server);
		session.on(
			'online',
			function() {
				if(typeof options.rooms != "undefined") {
					for(var room in options.rooms)
						session.joinRoom(options.rooms[room]);
				}
				if(typeof options.onConnect == "function")
					options.onConnect.call(session);
			}
		);
		session.on(
			'message',
			function(message) {
				options.onMessage.call(session, message);
			}
		);
		session.on(
			'presence',
			function(presence) {
				options.onPresence.call(session, presence);
			}
		);
		sessions.push(session);
	}

	this.init = function() {
		for(var s in sessions)
			sessions[s].init();
	}

}
util.inherits(Bot, events.EventEmitter);

module.exports = Bot;