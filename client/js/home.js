var socket = io.connect();

// div elements
var signInPage = document.getElementById('loginpage');
var gamePage = document.getElementById('full-page');

// Sign in elements
var signInForm = document.getElementById('signInForm');
var teamnameDropdown = document.getElementById('teamname', {passive: true});
var playernameField = document.getElementById('playername');
var playBtn = document.getElementById('playbtn');

// Game elements
var heading = document.getElementById('heading');
var inputcards = [];

for(var i = 1; i <= 13; i++) {
  console.log('input_card' + i);
  inputcards.push(document.getElementById('label_card' + i));
}

teamnameDropdown.onchange = function() {
  var teamname = teamnameDropdown.value
}

playernameField.oninput = function(e) {
  e.preventDefault();
  var name = playernameField.value
  console.log(name);
};

setUpCards = function(cardArray) {
  console.log("setting up cards");
  for(var i in cardArray) {

    inputcards[i].type = "checkbox";

    if (cardArray[i].suit == "redjoker" || cardArray[i].suit == "blackjoker") {
      var textstring = "Joker" + "&#x1F0CF;";
    } else {
      var textstring = cardArray[i].number + "&" + cardArray[i].suit + ";";
    }

    inputcards[i].innerHTML = textstring;
    inputcards[i].style.color = cardArray[i].color;
    console.log(cardArray);
  }
  console.log(inputcards);

}


playButtonClicked = function(){
  var teamname = teamnameDropdown.value;
  var name = playernameField.value;



  var data = {
        name : name,
        teamname : teamname
      }


  socket.emit('signInRequest', data);

  console.log("Waiting for server response");

  socket.on('signInResponse', function(data) {
    if (data.connected) {
        signInPage.style.display = 'none';
        gamePage.style.display = '';
        console.log(data.myCards);
        setUpCards(data.myCards);
      } else {
        console.log("Can not connect");
      }
  })
}

signInForm.onsubmit = function(e) {
    e.preventDefault();
    playButtonClicked();
}

playbtn.onclick = playButtonClicked;
