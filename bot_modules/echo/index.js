var Echo = function(options) {

	this.onMessage = function(message) {
		this.say(message.from, "Echo: " + message.body);
	}

}

module.exports = new Echo();