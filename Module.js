var Session = require("./Session.js"),
	util = require("util"),
	events = require("events");

var Module = function(moduleName, session) {

	if(typeof moduleName != "string")
		this.emit("error", "Module: options.name must be a string.");

	var botModule = require("./bot_modules/" + moduleName + "/index.js");

	if(!(session instanceof Session))
		this.emit("error", "Module: options.session must be a Session.");

	var session = session;

	var callbacks = {
		'online' :	(typeof botModule.onConnect == "function")
					?
					botModule.onConnect
					:
					function() {},
		'message' : (typeof botModule.onMessage == "function")
					?
					botModule.onMessage
					:
					function() {},
		'presence' : (typeof botModule.onPresence == "function")
					?
					botModule.onPresence
					:
					function() {}
	};

	session.on(
		"online",
		function() {
			callbacks.online.call(session);
		}
	);
	
	session.on(
		"message",
		function(message) {
			callbacks.message.call(session, message);
		}
	);
	
	session.on(
		"presence",
		function(presence) {
			callbacks.presence.call(session, presence);
		}
	);

}
util.inherits(Module, events.EventEmitter);

module.exports = Module;