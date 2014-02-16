var	Session = require("./Session.js"),
	util = require("util"),
	events = require("events");

var Bot = function(settings) {

	var initModules = function(modules) {
		var arr = [];
		if(!Array.isArray(modules))
			return arr;
		for(var m in modules) {
			if(typeof modules[m] != "string")
				continue;
			arr.push(
				require(
					"./bot_modules/" + modules[m] + "/index.js"
				)
			);
		}
		return arr;
	}

	var properties = {
		'name' :
			(typeof settings.name == "string")
			?
			settings.name
			:
			"node-xmpp-bot",
		'status' :
			(typeof settings.status == "string")
			?
			settings.status
			:
			"I am a bot",
		'modules' : initModules(settings.modules)
	};

	var sessions = [];

	this.addSession = function(options) {
		options.server.alias = properties.name;
		options.server.status = properties.status;
		var session = new Session(options.server);
		for(var m in properties.modules)
			var module = properties.modules[m].call(session);
		session.on(
			'online',
			function() {
				if(typeof options.rooms != "undefined") {
					for(var room in options.rooms)
						session.joinRoom(options.rooms[room]);
				}
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