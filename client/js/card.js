



function card(suit,number) {
  // Card Render

  // temp for rect
  this.xPos = 10;
  this.yPos = 10;
  this.width = 30;
  this.height = 60;

  this.suit = suit;
  this.number = number;

  // Set Color
  if (suit == "spadesuit" | "clubsuit" | "blackjoker") {
    this.color = "black";
  } else if (suit == "heartsuit" | "diamondsuit" | "redjoker") {
    this.color = "red"
  } else {
    this.color = "notset" // Deal with setting colours for joker
  }

  this.played = false;

  this.moveCard = function() {
    console.log("Test")
  };
};

card.prototype.moveCard = function() {
  // console.log("Moved Card");
  this.xPos = this.xPos + 10;

  if (this.xPos > 500) {
    this.xPos = 10;
  }
};
