var Echo = function() {
	var self = this;
	this.on(
		"message",
		function(message) {
			self.say(
				message.from,
				"You said: " + message.body
			);
		}
	)
}

module.exports = Echo;