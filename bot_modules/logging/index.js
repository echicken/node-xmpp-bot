var Logging = function() {
	var self = this;
	this.on(
		"online",
		function() {
			console.log(self.jid + " online");
		}
	);
	this.on(
		"message",
		function(message) {
			console.log("-Message-");
			console.log("From: " + message.from);
			console.log("Body: " + message.body);
		}
	);
	this.on(
		"presence",
		function(presence) {
			console.log("-Presence Update-");
			console.log("Contact: " + presence.contact);
			console.log("   Show: " + presence.show);
			console.log(" Status: " + presence.status);
			console.log(" Online: " + presence.online);
		}
	);
}

module.exports = Logging;