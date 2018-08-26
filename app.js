// TODO list
//
//
// TODO - get cards back into deck on disconnect
//
//
//
//
//
//



var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.");

var SocketList = {};
var PlayerList = {};

var Card = function(suit,number) {

		this.suit = suit;
		this.number = number;
		this.played = false;
		this.selected = false;
		this.chosen = false

	if (suit == "spadesuit" || suit == "clubsuit"  ||  suit == "blackjoker") {
    this.color = "black";
  } else if (suit == "heartsuit" || suit == "diamondsuit" ||  suit == "redjoker") {
    this.color = "red";
  } else
    this.color = "notset";

	return this;
}

var CardsManager = function() {

	this.cardDeck = [];
	var suitsArray = ['heartsuit','spadesuit','diamondsuit','clubsuit'];

	for (var i in suitsArray) {

	    for (var j = 1; j <= 13; j++) {
	      this.cardDeck.push(new Card(suitsArray[i], j));
	    };

  };
  this.cardDeck.push(new Card('redjoker',14));
  this.cardDeck.push(new Card('blackjoker',14));

	this.shuffle = function() {
		let counter = this.cardDeck.length;

		// While there are elements in the this.cardDeck
		while (counter > 0) {
				// Pick a random index
				let index = Math.floor(Math.random() * counter);

				counter--;

				let temp = this.cardDeck[counter];
				this.cardDeck[counter] = this.cardDeck[index];
				this.cardDeck[index] = temp;
		}
	}

	this.sortCards = function(cardsToSort) {

		sortedArray = [];

		var suitSortedArray;
		var numberSortedArray;

		for (var i in suitsArray) {

			suitSortedArray = [];
			numberSortedArray = [];

			for (var j in cardsToSort) {
				if (cardsToSort[j].suit == suitsArray[i])
					suitSortedArray.push(cardsToSort[j]);
			}

			numberSortedArray = suitSortedArray.sort(function(a,b)
			{return a.number - b.number});

			for (var k in numberSortedArray) {
				sortedArray.push(numberSortedArray[k]);
			}
		}

		return sortedArray;
	}

	// n is number of cards to give
	this.giveCards = function(n) {

		// console.log("Before giving " + this.cardDeck.length);
		var cardArray = this.cardDeck.splice(0,n);
		// console.log("After giving " + this.cardDeck.length);
		return cardArray;
	}

	this.addCardsBack = function(cardArray) {
		// console.log("Returning cards");
		// console.log(cardArray);
		// console.log("Before sorting " + this.cardDeck.length);
		for (var i in cardArray) {
			cardArray[i].played = false;
			cardArray[i].selected = false;
			cardArray[i].chosen = false;
			this.cardDeck.push(cardArray[i]);
		}
		// console.log("After sorting " + this.cardDeck.length);
	}

	return this;
}

var Player = function(id) {

	this.id = id,
	this.name =  null

	cardsmanager.shuffle();
	var cards = cardsmanager.giveCards(13);
	this.playerCards = cardsmanager.sortCards(cards);

	return this;
}

var Team = function(teamname) {

	this.name = teamname;
	this.players = {};

	this.addPlayer = function(player) {
		if (Object.keys(this.players).length < 2) {
			this.players[player.id] = player;
		}
	}

	this.removePlayer = function(player) {
		delete this.players[player.id];
	}

	this.canAddPlayer = function() {
		if (Object.keys(this.players).length < 2) {
			return true;
		}
		else {
			return false;
		}
	}
}












// Beginning of actual code
var cardsmanager = new CardsManager();
cardsmanager.shuffle();
var teamA = new Team("Team A");
var teamB = new Team("Team B");
var teamList = {
	"Team A" : teamA,
	"Team B" : teamB
};

io.sockets.on('connection', function(socket) {
	socket.connected = true;
	SocketList[socket.id] = socket;
	console.log("New User: " + socket.id);

	socket.on('signInRequest', function(data) {

		// Check team here
		if(data.teamname == "Team A" || data.teamname == "Team B") {

			if(teamList[data.teamname].canAddPlayer()) {


				console.log(data.name + " added to " + data.teamname);
				var player = new Player(socket.id);

				player.name = data.name;
				teamList[data.teamname].addPlayer(player);

				var dataPack = {
					connected : true,
					myCards: player.playerCards
				};

				socket.emit('signInResponse',dataPack);

				PlayerList[socket.id] = player;
				if (Object.keys(PlayerList).length == 4) {
					socket.emit('readyToPlay',{ready : true})
				}
			} else {
				console.log(data.teamname + " is full: " + Object.keys(teamList[data.teamname].players).length + "/2");
				socket.emit('signInResponse',{connected : false});
			}
		}
	});

	socket.on('disconnect', function() {

		socket.connected = false;
		console.log("User lost connection: " + socket.id);

	 	setTimeout(function() {
			if (socket.connected == false) {
				console.log("Disconnected user: " + socket.id);
				if (PlayerList[socket.id]){
					console.log("Deleting player associated with socket: " + socket.id);
					cardsmanager.addCardsBack(PlayerList[socket.id].playerCards);
					teamA.removePlayer(PlayerList[socket.id]);
					teamB.removePlayer(PlayerList[socket.id]);
					delete PlayerList[socket.id];
				}
				delete SocketList[socket.id];
			}
		},10000); //Reduced timeout for faster debugging - Return to 10000 later
	});

});
