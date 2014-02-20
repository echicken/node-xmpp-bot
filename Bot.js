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

	this.__defineGetter__(
		"name",
		function() {
			return properties.name;
		}
	);

	this.__defineSetter__(
		"name",
		function(name) {
			if(typeof name != "string")
				self.emit("error", "Bot.name must be a string.")
			for(var s in properties.sessions)
				properties.sessions[s].alias = name;
		}
	);

	this.__defineGetter__(
		"status",
		function() {
			return properties.status;
		}
	);

	this.__defineSetter__(
		"status",
		function(status) {
			if(typeof status != "string")
				self.emit("error", "Bot.status must be a string.");
			for(var s in properties.sessions)
				properties.sessions[s].status = status;
		}
	);

	this.addModule = function(options) {
		if(typeof options.name != "string")
			this.emit("error", "Bot.addModule: module name must be a string.");
		for(var s in properties.sessions)
			new Module(options, properties.sessions[s]);
		properties.modules.push(options);
	}

	this.addSession = function(options) {
		options.server.alias = (
			(typeof options.alias == "undefined")
			?
			properties.name
			:
			options.alias
		);
		options.server.status = (
			(typeof options.status == "undefined")
			?
			properties.status
			:
			options.status
		);
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

}
util.inherits(Bot, events.EventEmitter);

module.exports = Bot;