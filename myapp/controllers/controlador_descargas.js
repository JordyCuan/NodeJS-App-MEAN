function descargar(req, res, fileName) {
	var options = {
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true,
			'mimetype': "application/octet-stream",
			'Content-Type' : "application/octet-stream"
		}
	};

	console.log(fileName);
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
	var uploads = "/home/jordy/node_projects/myapp/uploads/";
	var fileName = uploads + req.user._email + "/" + req.params.obj;;

	descargar(fileName);
}


// GET - /file/decimado/:obj
exports.desc_decimado = function (req, res) {
	var uploads = "/home/jordy/node_projects/myapp/uploads/";
	var fileName = uploads + req.user._email + "/decimar/" + req.params.obj;;

	descargar(fileName);
}
