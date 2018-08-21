var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});
var total_connections = 0;

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

//app.get('/game',function(req, res) {
//	res.sendFile(__dirname + '/client/game.html');
//});

app.use('/client',express.static(__dirname + '/client'));
serv.listen(2000);
console.log("Server started.");

var allClients = [];

io.sockets.on('connection', function(socket) {
   allClients.push(socket);
   total_connections++;
   console.log('connections '+total_connections);

   socket.on('disconnect', function() {
      console.log('Got disconnect!');
      total_connections--;
      console.log('connections '+total_connections);
      var i = allClients.indexOf(socket);
      allClients.splice(i, 1);
   });
	 
   if (total_connections<4){
       io.sockets.emit('newplayer', {hello: 'Nello'})
   } else {io.sockets.emit('toomanyplayers', {hello: 'Yello'})}

    socket.on('ev_playerDetails',function(player){
        console.log(player.name);
        console.log(player.team);
    });

});
