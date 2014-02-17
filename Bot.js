var	Session = require("./Session.js"),
	util = require("util"),
	events = require("events");

var Bot = function(settings) {

	var self = this;

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
		'modules' : [],
		'sessions' : []
	};

	this.addModule = function(module) {
		if(typeof module != "string")
			this.emit("error", "Bot.addModule: module name must be string.");
		var botModule = require("./bot_modules/" + module + "/index.js");
		for(var s in properties.sessions)
			botModule.call(properties.sessions[s]);
		properties.modules.push(botModule);
	}

	this.addSession = function(options) {
		options.server.alias = properties.name;
		options.server.status = properties.status;
		var session = new Session(options.server);
		for(var m in properties.modules)
			properties.modules[m].call(session);
		session.on(
			'online',
			function() {
				if(typeof options.rooms != "undefined") {
					for(var room in options.rooms)
						session.joinRoom(options.rooms[room]);
				}
			}
		);
		properties.sessions.push(session);
	}

	this.init = function() {
		for(var s in properties.sessions)
			properties.sessions[s].init();
	}

}
util.inherits(Bot, events.EventEmitter);

module.exports = Bot;