node-xmpp-bot
=============

An XMPP bot based on node-xmpp-client.

###Bot.js

Provides the **Bot** object, which draws **Session** and **Module** together to make a working bot.

####The Bot object

#####Properties

* **Bot.name** - The alias / nickname of the bot. (String)
* **Bot.status** - The bot's status message. (String)

#####Methods

* **Bot.addModule(moduleName)** - Add module *moduleName* to the bot, where *moduleName* references the name of a subdirectory of bot_modules.
* **Bot.addSession(options)** - Add a client-to-server session to the bot, configured via the *options* object-as-argument (see example.)

#####Usage

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

Provides the **Module** object, which you do not need to reference directly.  Instead, let's talk about **Modules**:

###Modules

*This part of the documentation will see some updates as module options get fleshed out.*

Bot modules reside in subdirectories of the **bot_modules** directory, and are loaded into the bot by calling *bot*.addModule(*name*), where *name* is the name of a module's directory.  A bot module directory must contain a file named *index.js*, which defines and exports an object.

A separate instance of each bot module exists for each server that the bot is connected to.

The exported object has access to a variable called **session** which is an instance of the **Session** object.  Use **session** to interact with the server to which a given module is attached.

Upon a successful connection to a server, a call will be made to a module's **onConnect** method, if it is defined.

Upon the receipt of an incoming message, a call will be made to a module's **onMessage** method, if it exists.  That method will be supplied with a *message* object, which will take the following form:

```js
{	'from' : <JID of sender>,
	'body' : <Text of message>
}
```

Upon the receipt of a presence update, a call will be made to a module's **onPresence** method, if it is defined.  That method will be supplied with a *presence* object, which will take the following form:

```js
{	'contact' : <JID of user>,
	'show' : <Text of a presence stanza's <show> element>,
	'status' : <The user's status>,
	'online' : <Boolean, whether the user is currently online or not>
}
```

A few example modules exist in the **bot_modules** directory.  Here are the contents of **bot_modules/echo/index.js**:

```js
var Echo = function(session) {

	this.onMessage = function(message) {
		session.say(message.from, "Echo: " + message.body);
	}

}

module.exports = Echo;
```

Since the module resides in the **echo** subdirectory of the **bot_modules** directory, you could load it into your bot as follows:

```js
bot.addModule("echo");
```

And as you might expect, it echoes back whatever text another user sends to it.

###Session.js

Provides the **Session** object, which is essentially a wrapper around **node-xmpp-client**.  **Session** provides a simple API for creating an overly-simplified XMPP client session.

####The Session object