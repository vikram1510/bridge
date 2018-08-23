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

var AllSockets = {};
var PlayerList = {};

var Card = function(suit,number) {

		this.suit = suit;
		this.number = number;
		this.played = false;
		this.selected = false;


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
	var suitsArray = ['heartsuit','spadesuit','diamondsuit','clubsuit','blackjoker','redjoker'];

	for (var i in suitsArray) {
		if (i <= 3) {
    for (var j = 1; j <= 13; j++) {
      this.cardDeck.push(new Card(suitsArray[i], j));
    };
		}
  };
  this.cardDeck.push(new Card('redjoker',14));
  this.cardDeck.push(new Card('blackjoker',14));

	this.shuffle = function() {
		let counter = this.cardDeck.length;

		// While there are elements in the this.cardDeck
		while (counter > 0) {
				// Pick a random index
				let index = Math.floor(Math.random() * counter);

				// Decrease counter by 1
				counter--;

				// And swap the last element with it
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

			numberSortedArray = suitSortedArray.sort(function(a,b){return a.number - b.number});

			for (var k in numberSortedArray) {
				sortedArray.push(numberSortedArray[k]);
			}
		}

		return sortedArray;
	}

	// n is number of cards to give
	this.giveCards = function(n) {
		var cardArray = this.cardDeck.splice(0,n);
		return cardArray;
	}

	this.addCardsBack = function(cardArray) {
		for (var i in cardArray)
			cardArray[i].played = false;
			cardArray[i].selected = false;
			this.cardDeck.push(cardArray[i]);
	}

	return this;
}

var Player = function(id,cardsmanager) {
	var self = {
		id:id,
		name : null
	}

	cardsmanager.shuffle();
	var cards = cardsmanager.giveCards(13);
	this.playerCards = cardsmanager.sortCards(cards);

	return this;
}

var Team = function(teamname) {
	this.name = teamname;
	this.players = [];

	this.addPlayer = function(person) {
		if (this.players.length < 2) {
			this.players.push(person);
		}
	}

	this.removePlayer = function(person) {
		console.log("Remove: " + person);;
	}

	this.canAddPlayer = function() {
		if (this.players.length < 2) {
			return true;
		} else {
			return false;
		}
	}
}

var cardsmanager = new CardsManager();
cardsmanager.shuffle();
var teamA = new Team("Team A");
var teamB = new Team("Team B");
var teamList = {
	"Team A" : teamA,
	"Team B" : teamB
};

io.sockets.on('connection', function(socket) {
	console.log("New User: " + socket.id);
	socket.connected = true;
	AllSockets[socket.id] = socket;

	socket.on('signInRequest', function(data) {

		var dataPack = [];
		var player = new Player(socket.id, cardsmanager);

		// Check username and team here
		if(data.teamname == "Team A" || data.teamname == "Team B") {
			console.log("Team recived: " + data.teamname);
			if(teamList[data.teamname].canAddPlayer()) {

				PlayerList[socket.id] = player;
				player.name = data.name;

				var waiting = true;
				console.log(data.name + " added to " + data.teamname);
				teamList[data.teamname].addPlayer(player);

				dataPack = {
					connected : true,
					waiting : waiting,
					myCards: player.playerCards
				};

				socket.emit('signInResponse',dataPack);

				console.log(Object.keys(PlayerList).length);
				if (PlayerList.length == 4) {
					socket.emit('readyToPlay',{ready : true})
				}
			} else {
				console.log("Selected team is full");
				socket.emit('signInResponse',{connected : false});
			}
		}
	}
	);

   socket.on('disconnect', function() {
		 	socket.connected = false;
			console.log("User lost connection!");
		 	setTimeout(function() {
				if (socket.connected == false) {
					console.log("Disconnected user");
					teamA.removePlayer(PlayerList[socket.id]);
					teamB.removePlayer(PlayerList[socket.id]);
					delete AllSockets[socket.id];
					delete PlayerList[socket.id];
				}
			},10000);
   });

});


setInterval(function() {


	//
	// for(var i in PlayerList) {
	//
	// 	var player = PlayerList[i];
	//
	// }
	// for(var i in PlayerList) {
	//
	// }



})
