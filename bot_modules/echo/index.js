var Echo = function(session) {

	this.onMessage = function(message) {
		session.say(message.from, "Echo: " + message.body);
	}

}

module.exports = Echo;