var Logging = function(options) {

	this.onConnect = function() {
		console.log(this.jid + " online.");
	}

	this.onMessage = function(message) {
		console.log("-Message-");
		console.log("From: " + message.from);
		console.log("Body: " + message.body);
	}

	this.onPresence = function(presence) {
		console.log("-Presence Update-");
		console.log("Contact: " + presence.contact);
		console.log("   Show: " + presence.show);
		console.log(" Status: " + presence.status);
		console.log(" Online: " + presence.online);
	}
}

module.exports = new Logging();