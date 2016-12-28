var CONFIG = require('./config.js');
var express = require('express');
var BufferHelper = require('bufferhelper');
var cors = require('cors');
var app = express();

app.use(cors());

app.all('/ErrorReport', function(req, res, next) {
	var bufferHelper = new BufferHelper();

	req.on("data", function(chunk) {
		bufferHelper.concat(chunk);
	});

	req.on('end', function() {
		try {
			var content = bufferHelper.toBuffer().toString();
			console.log(JSON.parse(content));
			res.writeHead(200);
			res.end('ok');
		} catch (e) {
			console.log('Error: ', e.stack);
		}
	});
});

app.listen(CONFIG.Server.PORT, function() {
	console.log('server listening on port ' + CONFIG.Server.PORT);
});
