var	Client = require('node-xmpp-client'),
	ltx	= require('ltx'),
	util = require('util'),
	events = require('events');

var Session = function(options) {
	
	var	self = this,
		roster = {},
		rooms = [],
		client;

	var settings = {
		'username' : "",
		'alias' : "",
		'password' : "",
		'hostname' : "",
		'port' : 5222,
		'reconnect' : true,
		'register' : false,
		'status' : ""
	}

	this.__defineGetter__(
		'jid',
		function() {
			return settings.username + "@" + settings.hostname;
		}
	);
	this.__defineSetter__('jid', function(){});

	this.__defineGetter__(
		'status',
		function() {
			return settings.status;
		}
	);

	this.__defineSetter__(
		'status',
		function(status) {
			settings.status = status;
			client.send(
				new ltx.Element(
					'presence',	{}
				).c('show').t('chat').up().c('status').t(
					settings.status
				)
			);
		}
	);

	this.__defineGetter__(
		'roster',
		function() {
			return roster;
		}
	);
	this.__defineSetter__('roster', function(){});

	this.__defineGetter__(
		'rooms',
		function() {
			return rooms;
		}
	);
	this.__defineSetter__('rooms', function(){});

	this.joinRoom = function(roomJID) {
		client.send(
			new ltx.Element(
				'presence',
				{	'from' : client.jid,
					'id' : roomJID.split("@")[0],
					'to' : roomJID + "/" + settings.alias
				}
			)
		);
		// Should check if join was successful ... later.
		rooms.push(roomJID);
	}

	this.say = function(jid, message) {
		client.send(
			new ltx.Element(
				'message',
				{	'type' : (rooms.indexOf(jid) >= 0) ? "groupchat" : "chat",
					'to' : jid,
					'from' : self.jid			
				}
			).c('body').t(message)
		);
	}

	var handleIQ = function(stanza) {
		if(	stanza.attrs.type == "get"
			&&
			typeof stanza.getChild("ping") != "undefined"
		) {
			client.send(
				new ltx.Element(
					'iq',
					{	'to' : stanza.attrs.from,
						'from' : stanza.attrs.to,
						'id' : stanza.attrs.id,
						'type' : "result"						
					}
				)
			);
		}
	}

	var handlePresence = function(stanza) {
		if(	typeof stanza.attrs.type != "undefined"
			&&
			stanza.attrs.type == "probe"
		) {
			self.status = settings.status;
		} else {
			var contact = stanza.attrs.from.split("/")[0];
			if(rooms.indexOf(contact) >= 0)
				return;
			roster[contact] = {
				'show' :
					(typeof stanza.getChild("show") == "undefined")
					?
					(	(typeof roster[contact] == "undefined")
						?
						""
						:
						roster[contact].show
					)
					:
					stanza.getChildText("show"),
				'status' :
					(typeof stanza.getChild("status") == "undefined")
					?
					(	(typeof roster[contact] == "undefined")
						?
						""
						:
						roster[contact].status
					)
					:
					stanza.getChildText("status"),
				'online' :
					(	typeof stanza.attrs.type != "undefined"
						&&
						stanza.attrs.type == "unavailable"
					)
					?
					false
					:
					true
			};
			self.emit(
				"presence",
				{	'contact' : contact,
					'show' : roster[contact].show,
					'status' : roster[contact].status
				}
			);
		}
	}

	var handleMessage = function(stanza) {
		if(	stanza.attrs.type == "error"
			||
			typeof stanza.getChild("body") == "undefined"
			||
			typeof stanza.getChild("delay") != "undefined"
			||
			stanza.attrs.from.split("/")[1] == settings.alias
		) {
			return;
		}
		self.emit(
			"message",
			{	'from' :
					(stanza.attrs.type == "chat")
					?
					stanza.attrs.from
					:
					stanza.attrs.from.split("/")[0],
				'body' : stanza.getChildText('body')
			}
		);
	}

	var initSettings = function(options) {
		for(var o in options) {
			if(typeof settings[o] != typeof options[o]) {
				throw util.format(
					"Session: Type mismatch: %s must be %s",
					o, typeof settings[o]
				);
			}
			settings[o] = options[o];
		}
		if(settings.username == "")
			throw "Session: Invalid username";
		if(settings.password == "")
			throw "Session: Invalid password";
		if(settings.hostname == "")
			throw "Session: Invalid hostname";
		if(settings.alias == "")
			settings.alias = settings.username;
	}

	var initClient = function() {

		client = new Client(
			{	'jid' : self.jid,
				'password' : settings.password,
				'hostname' : settings.hostname,
				'port' : settings.port,
				'reconnect' : settings.reconnect,
				'register' : settings.register
			}
		);
		client.connection.socket.setTimeout(0);
		client.connection.socket.setKeepAlive(true, 10000);

		client.on(
			'online',
			function() {
				self.status = settings.status;
				self.emit("online");
			}
		);

		client.on(
			'stanza',
			function(stanza) {
				if(stanza.is("message"))
					handleMessage(stanza);
				else if(stanza.is("presence"))
					handlePresence(stanza);
				else if(stanza.is("iq"))
					handleIQ(stanza);
			}
		);

	}

	this.init = function() {
		initSettings(options);
		initClient();
	}

}
util.inherits(Session, events.EventEmitter);

module.exports = Session;