node-xmpp-bot
=============

An XMPP bot based on node-xmpp-client.

###Installation

```sh
git clone https://github.com/echicken/node-xmpp-bot.git
cd node-xmpp-bot
npm install
```

###Configuration

Edit the included **config.js** file to suit your needs.  It's essentially JSON, so keep an eye on syntax.  Most options are self-explanatory.

Note that **servers** and **modules** are arrays of object literals.  **servers** is a list of servers to connect to (and options to apply to each session,) and **modules** is a list of modules to load into the bot (from the **bot_modules** subdirectory.)

An object in the **servers** array has two properties at its top level: **server** and **rooms**, where **server** is in turn an object, and **rooms** is an array of strings.  To see valid sub-properties of the **server** property, look at the **Session** documentation below.  The **rooms** array is simply a list of the JIDs of multi-user chat rooms the bot should join upon connecting to the server.

An object in the **modules** array must have a **name** property, which is a reference to a subdirectory of **bot_modules**.  It may also have a **servers** property, which must be an array of strings, each string being a reference to a server's **server.name** property; this list controls which servers the module will be active on.  You may also include a **JIDs** property, which must be an array of JIDs that the bot is allowed to send messages to.  If you omit **servers**, the module will be enabled on all servers to which the bot is connected.  If you omit **JIDs**, the module will be permitted to send messages to all users.

```js
module.exports = {
	'name' : "Jabber Bot",
	'status' : "I am a bot",
	'servers' : [
		{	'server' : {
				'name' : "example",
				'username' : "example",
				'password' : "3x4mpl3",
				'hostname' : "example.jabber.server.hostname",
				'port' : 5222
			},
			'rooms' : [
				'exampleRoom@conference.example.jabber.server.hostname'
			]
		}
	],
	'modules' : [
		{	'name' : "echo",
			'servers' : [
				"example"
			]
		},
		{ 'name' : "logging" }
	]
};
```

###Usage

```sh
node index.js
```

###Bot.js

Provides the **Bot** object, which draws **Session** and **Module** together to make a working bot.

####The Bot object

#####Properties

* **Bot.name** - The alias / nickname of the bot. (String)
* **Bot.status** - The bot's status message. (String)

#####Methods

* **Bot.addModule({ 'name' : *moduleName* })** - Add module *moduleName* to the bot, where *moduleName* references the name of a subdirectory of bot_modules. (See example for additional options.)
* **Bot.addSession(options)** - Add a client-to-server session to the bot, configured via the *options* object-as-argument (see example.)

#####Usage

```js
var Bot = require("/path/to/Bot.js");
var bot = new Bot(
	{	'name' : "node.js XMPP Bot",
		'status' : "I are bot yesno?"
	}
);
bot.addModule({ 'name' : "logging" });
bot.addModule(
	{	'name' : "echo",
		'servers' : [
			"FakeServer"
		]
	}
);
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

Bot modules reside in subdirectories of the **bot_modules** directory, and are loaded into the bot by calling *bot*.addModule({ 'name' : *name* }), where *name* is the name of a module's directory.  A bot module directory must contain a file named *index.js*, which defines and exports an object.

A separate instance of each bot module exists for each server that the bot is connected to.

The exported object has access to a variable called **session** which is an instance of the **Session** object.  Use **session** to interact with the server to which a given module is attached.

Upon a successful connection to a server, a call will be made to a module's **onConnect** method, if it is defined.

Upon the receipt of an incoming message, a call will be made to a module's **onMessage** method, if it exists.  That method will be supplied with a *message* object, which will take the following form:

```js
{	'from' : <String: JID of sender>,
	'body' : <String: Text of message>
}
```

Upon the receipt of a presence update, a call will be made to a module's **onPresence** method, if it is defined.  That method will be supplied with a *presence* object, which will take the following form:

```js
{	'contact' : <String: JID of user>,
	'show' : <String: Text of a presence stanza's <show> element>,
	'status' : <String: The user's status>,
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
bot.addModule({ 'name' : "echo" });
```

And as you might expect, it echoes back whatever text another user sends to it.

###Session.js

Provides the **Session** object, which is essentially a wrapper around **node-xmpp-client**.  **Session** provides a simple API for creating an overly-simplified XMPP client session.  Could be used on its own if you want to implement your own simple XMPP client, but you should disregard this section otherwise.

####The Session object

#####Properties

* **Session.name** - A name for this session, for convenience only. (String)
* **Session.jid** - The JID of the user account connected to the server. (String, *read only*)
* **Session.alias** - The alias/nickname for this account. (String)
* **Session.status** - The status message for this account. (String)
* **Session.roster** - Contact list. (Array of contact JID strings, *read only*)
* **Session.rooms** - Rooms this account is joined to. (Array of MUC room JID strings, *read only*)

#####Methods

* **Session.joinRoom(roomJID)** - Join room *roomJID*
* **Session.say(jid, message)** - Say *message* to user/room with JID *jid*
* **Session.init()** - Initialize and connect to server

#####Usage

```js
var Session = require("/path/to/Session.js");
var session = new Session(
	{	'name' : <String: A convenient name for this session>,
		'username' : <String: The 'username' portion of this client's JID>,
		'alias' : <String: The alias or nickname for this client>,
		'password' : <String: The password for this user's account>,
		'hostname' : <String: The 'hostname' portion of this client's JID>,
		'port' : <Number: The port to connect to, defaults to 5222>,
		'reconnect' : <Boolean: Automatically reconnect, defaults to true>,
		'register' : <Boolean: Register new account with server, default is false>,
		'status' : <String: This client's 'status' message>
	}
);
```