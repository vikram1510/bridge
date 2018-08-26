//TODO List
//
//
//
//
//
//


var ready = false;
var keeplogging = true;


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
var inputcards = [];
var chosencards = [];
var cardWidth;
var cardHeight;
var deckStartX;
var deckStartY;
var deckWidth;
var cardSelected = false;

// var img;
var cardimgarray = {};

function preload() {


  var defaultpath = 'client/assets/card';
  var filetype = '.png'
  var suitsArray = ['heartsuit','spadesuit','diamondsuit','clubsuit'];

  for (var i = 0; i < 4; i++) {

    var suit = suitsArray[i];

    for (var j = 1; j <= 13; j++) {
      var number = j;

      imagepath = defaultpath + suit + number + filetype;
      var tempImg =  loadImage(imagepath);

      cardimgarray[suit + number] = tempImg;
    }

    cardimgarray['redjoker14'] = loadImage('client/assets/cardredjoker14.png');
    cardimgarray['blackjoker14'] = loadImage('client/assets/cardblackjoker14.png');


  }

}

function setup() {

teamnameDropdown.onchange = function() {
  var teamname = teamnameDropdown.value
}

playernameField.oninput = function(e) {
  e.preventDefault();
  var name = playernameField.value
  console.log(name);
};

setupDeck = function(inputcards) {

  if(windowWidth > 900 && windowHeight > 300)   {
    cardWidth = windowWidth/11;
    cardHeight =  cardWidth * 1.4;
  }

  deckStartX = (windowWidth - ((cardWidth-30)*inputcards.length))/2;
  deckStartY = windowHeight-cardHeight+30;

  var d = 0;
  for(var i in inputcards) {
    // inputcards[i].overlap = (30-d)*i;
    inputcards[i].xPos = deckStartX+((cardWidth-30-d)*i);
    if(inputcards[i].chosen == false) {
    inputcards[i].yPos = deckStartY;
    } else {
    inputcards[i].yPos = deckStartY-60;
    }
    d++;
  }

  deckWidth = inputcards[inputcards.length-1].xPos - inputcards[0].xPos + cardWidth;

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
        // gamePage.style.display = '';
        createCanvas(windowWidth,windowHeight);
        inputcards = data.myCards;
        setupDeck(inputcards);
        ready = true;
      } else {
        console.log("Can not connect");
      }
  })

  socket.on('someone', function(data) {
    console.log("Somoene played a card");
  })

}


signInForm.onsubmit = function(e) {
    e.preventDefault();
    playButtonClicked();
}

playbtn.onclick = playButtonClicked;

}


function draw() {

if (ready == true) {
background(24, 141, 74)
fill(255);

var c = 12;
for(var i in inputcards) {

    // MOUSEOVER Detection
    if(mouseY > inputcards[c].yPos &&  mouseX > inputcards[c].xPos &&
       mouseX < inputcards[c].xPos + cardWidth && cardSelected == false) { // Mouse is between input card and no other cards selected

        cardSelected = true;
        inputcards[c].selected = true;

        if(inputcards[c].yPos > deckStartY-60 && inputcards[c].selected) { // Bring up card position
          inputcards[c].yPos = inputcards[c].yPos - 10;
        }
    } else {
      inputcards[c].selected = false;
      cardSelected = false;
    }


    if (inputcards[c].selected == false && inputcards[c].yPos < deckStartY) {
        inputcards[c].yPos = inputcards[c].yPos + 10;
    }

  c--;

  // OLD LOGIC FOR DISPLAYING CARDS
  // fill(255);
  // stroke(200);
  // strokeWeight(1);
  // var bool = inputcards[i].selected == true || inputcards[i].chosen == true;
  // console.log(bool);
  // if(inputcards[i].selected == true || inputcards[i].chosen == true) {
  //   fill(240);
  //   stroke(2);
  //   strokeWeight(2);
  // }
  // rect(inputcards[i].xPos , inputcards[i].yPos, cardWidth , cardHeight , 10);
  // fill(inputcards[i].color);
  // textSize(20);
  // textStyle(BOLD);
  // noStroke();
  // text(inputcards[i].number, inputcards[i].xPos + 15, inputcards[i].yPos + 25);

  if(inputcards[i].chosen == true) {
      // tint(0, 153, 204);
      inputcards[i].yPos = deckStartY-70;
    }
  var img = image(cardimgarray[inputcards[i].suit+inputcards[i].number], inputcards[i].xPos , inputcards[i].yPos, cardWidth , cardHeight);


}

playcardbtnWidth = 120;
playcardbtnHeight = 30;
fill(20,200,30);
noStroke();
rect(deckStartX + deckWidth/2 -playcardbtnWidth/2, deckStartY-110, playcardbtnWidth ,playcardbtnHeight,5);

var textstring = mouseX + "," + mouseY;
fill(255);
text(textstring,50,50);

}

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupDeck(inputcards);
}

function mouseClicked() {
  console.log("mouseClicked");
  var c = 12;
  for (var i in inputcards) {

    // if(mouseY > inputcards[c].yPos) {
    //   if(mouseX > inputcards[c].xPos && mouseX < (inputcards[c].xPos + windowWidth/11) && inputcards[i].chosen == true) {
    //     inputcards[i].chosen == false;
    //   }
    // } else


    if(mouseY > inputcards[c].yPos &&  mouseX > inputcards[c].xPos &&
       mouseX < inputcards[c].xPos + cardWidth && inputcards[c].chosen == true) {

       inputcards[c].chosen = false;
       inputcards[c].yPos += 10;
       console.log("Unchose: " + inputcards[c].suit + inputcards[c].number);
       break;
     } else if (inputcards[c].selected) {
      inputcards[c].chosen = true;
      inputcards[c].selected = false;
      cardSelected = false;
      console.log("Chosen: " + inputcards[c].suit + inputcards[c].number);
      chosencards.push(inputcards[c]);

      socket.emit('chosencards', {selectedCard:chosencards})
      break;
    }


        c--;
  }





}
