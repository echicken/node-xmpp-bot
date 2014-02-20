var Session = require("./Session.js"),
	events = require("events"),
	util = require("util");

var Module = function(options, session) {

	if(typeof options.name != "string")
		this.emit("error", "Module: options.name must be a string.");

	if(!(session instanceof Session))
		this.emit("error", "Module: options.session must be a Session.");

	if(	typeof options.servers != undefined
		&&
		Array.isArray(options.servers)
		&&
		options.servers.indexOf(session.name) < 0
	) {
		return;
	}

	var botModule = new (
		require("./bot_modules/" + options.name + "/index.js")
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
			if(	typeof options.JIDs != "undefined"
				&&
				Array.isArray(options.JIDs)
				&&
				options.JIDs.indexOf(message.from) < 0
			) {
				return;
			}
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