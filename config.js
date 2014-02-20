module.exports = {
	'name' : "Jabber Bot",
	'status' : "I am a bot",
	'servers' : [
		{	'server' : {
				'name' : "example",
				'username' : "example",
				'password' : "3x4mpl3",
				'hostname' : "example.jabber.server.hostname",
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