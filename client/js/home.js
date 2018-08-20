$(document).ready(function() {


    var socket = io.connect();
    $("#team").change(function () {
        var team = $('#team').find(":selected").text();
        console.log(team)
    });

    $('#playername').on('input', function() {
        var name = $('#playername').val();
        console.log(name)
    });

    $('#play').on('click', function() {
        var name = $('#playername').val();
        var team = $('#team').find(":selected").text();
        if (name) {console.log('valid');} else {console.log('invalid');}
        if (name){
            window.location.href = '/client/game.html';
            socket.emit('ev_playerDetails',
                {
                    name: name,
                    team: team
                }
            );
        }
    });
    //href="/client/game.html"
    socket.on('newplayer',function(data){
        console.log(data.hello)
    })

});






//var addPlayer = function(id){
//	var self = {
//		name: "player 1",
//		id:id,
//		number: "" + Math.floor(10*Math.random()),
//		cards:1,
//		playedCards:1
//	}
//	return self;
//}






