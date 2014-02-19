var Session = require("./Session.js"),
	events = require("events"),
	util = require("util");

var Module = function(moduleName, session) {

	if(typeof moduleName != "string")
		this.emit("error", "Module: options.name must be a string.");

	if(!(session instanceof Session))
		this.emit("error", "Module: options.session must be a Session.");

	var botModule = new (
		require("./bot_modules/" + moduleName + "/index.js")
	)(session);

	session.on(
		"online",
		function() {
			if(typeof botModule.onConnect == "function")
				botModule.onConnect();
		}
	);
	
	session.on(
		"message",
		function(message) {
			if(typeof botModule.onMessage == "function")
				botModule.onMessage(message);
		}
	);
	
	session.on(
		"presence",
		function(presence) {
			if(typeof botModule.onPresence == "function")
				botModule.onPresence(presence);
		}
	);

}
util.inherits(Module, events.EventEmitter);

module.exports = Module;