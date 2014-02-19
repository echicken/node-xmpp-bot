node-xmpp-bot
=============

An XMPP bot based on node-xmpp-client.

###Bot.js

Provides the **Bot** object, which draws **Session** and **Module** together to make a working bot.

####Properties

* **Bot.name** - The alias / nickname of the bot. (String)
* **Bot.status** - The bot's status message. (String)

####Methods

* **Bot.addModule(moduleName)** - Add module <moduleName> to the bot, where <moduleName> references the name of a subdirectory of bot_modules.
* **Bot.addSession(options)** - Add a client-to-server session to the bot, configured via the <options> object-as-argument (see example.)

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

###Module.js

Provides the **Module** object, which you do not need to reference directly.  Instead, let's talk about **Modules**

###Modules

*This part of the documentation will see some updates as module options get fleshed out.*