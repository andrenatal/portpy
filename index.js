var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){

	fs.writeFile('python.py', msg, function (err) {
	  if (err) return console.log(err);
	  //console.log('Hello World > helloworld.txt');
 	});

	var spawn = require('child_process').spawn, ls    = spawn('python', ['python.py'],{detached:true});

	ls.stdout.on('data', function (data) {
 	  console.log('stdout: ' + data);			
		socket.emit('result', data.toString() );

	});

	ls.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	  socket.emit('result', data.toString() );	  
	});

	ls.on('close', function (code) {
	  console.log('child process exited with code ' + code);
	});

	ls.unref();



  });
});
