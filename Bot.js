var	Session = require("./Session.js"),
	Module = require("./Module.js"),
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

	this.addModule = function(moduleName) {
		if(typeof moduleName != "string")
			this.emit("error", "Bot.addModule: module name must be string.");
		for(var s in properties.sessions)
			new Module(moduleName, properties.sessions[s]);
		properties.modules.push(moduleName);
	}

	this.addSession = function(options) {
		options.server.alias = properties.name;
		options.server.status = properties.status;
		var session = new Session(options.server);
		for(var m in properties.modules)
			new Module(properties.modules[m], session);
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