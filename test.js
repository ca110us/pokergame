var http = require('http');
var globalTest = 0;


var app = http.createServer(function (request, response){


  globalTest++;
 console.log("--" + globalTest);

 response.writeHead(200, {
   'Content-Length': 0,
   'Content-Type': 'text/plain' });
 response.end();
 
}).listen(1215);

console.log("start run server at port: 1215");