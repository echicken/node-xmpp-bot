node-xmpp-bot
=============

An XMPP bot based on node-xmpp-client.

###Bot.js

####Properties

* **Bot.name**
The alias / nickname of the bot. (String)
* **Bot.status**
The bot's status message. (String)

####Methods

* **Bot.addModule(moduleName)**
Add module <moduleName> to the bot, where <moduleName> references the name of a subdirectory of bot_modules.
* **Bot.addSession(options)**
Add a client-to-server session to the bot, configured via the <options> object-as-argument (see example.)

####Usage

```js
var Bot = require("path/to/Bot.js");
var bot = new Bot(
	{	'name' : "node.js XMPP Bot",
		'status' : "I are bot yesno?"
	}
);
bot.addModule("logging");
bot.addModule("echo");
bot.addSession(
	{	'server' : {
			'name' : "FakeServer",
			'username' : "robot",
			'password' : "tobor",
			'hostname' : "jabber-server.fakedomain.internet",
			'alias' : "Mr. Roboto", // Overrides bot.name if included.
			'status' : "I am a bot, you probably are not." // Ditto re: status
		},
		'rooms' : [
			"testroom@conference.jabber-server.fakedomain.internet"
		]
	}
);
```