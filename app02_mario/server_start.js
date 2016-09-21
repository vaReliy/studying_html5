var http = require('http');
var static = require('node-static');
var file = new static.Server('.');

http.createServer(function(req, res) {
  file.serve(req, res);
}).listen(63342);

console.log('Server running on port 63342');
console.log('http://localhost:63342/mario_app.html');