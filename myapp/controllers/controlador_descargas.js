var path = require('path');

function descargar(req, res, fileName) {
	var options = {
		root: path.join(__dirname, "../uploads/"),
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true,
			'mimetype': "application/octet-stream",
			'Content-Type' : "application/octet-stream"
		}
	};

	res.sendFile(fileName, options, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Sent:', fileName);
		}
	});
}


// GET - /file/original/:obj
exports.desc_original = function (req, res) {
	var uploads = "/";
	var fileName = uploads + req.user._email + "/" + req.params.obj;

	descargar(req, res, fileName);
}


// GET - /file/decimado/:obj
exports.desc_decimado = function (req, res) {
	var uploads = "/";
	var fileName = uploads + req.user._email + "/decimar/" + req.params.obj;;

	descargar(req, res, fileName);
}