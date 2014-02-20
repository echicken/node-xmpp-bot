var	config = require('./config.js'),
	Bot = require('./Bot.js');

var bot = new Bot(
	{	'name' : config.name,
		'status' : config.status
	}
);

for(var s in config.servers)
	bot.addSession(config.servers[s]);

for(var m in config.modules)
	bot.addModule(config.modules[m]);