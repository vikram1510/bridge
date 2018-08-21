var socket = io.connect();
var apple = 1;
socket.emit('apple',
    {
        taste: 'nice'
    }
);


