function card(tempSuit,tempNumber) {

  this.played = false;
  this.selected = true;

  const suit = tempSuit;
  const number = tempNumber;

  let tempcolor;

  // Set Color
  if (suit == "spadesuit" ||
      suit == "clubsuit"  ||
      suit == "blackjoker") {

    tempcolor = "black";

  } else if (suit == "heartsuit" ||
             suit == "diamondsuit" ||
             suit == "redjoker") {

    tempcolor = "red";

  } else {
    tempcolor = "notset";
  }

  const color = tempcolor;

// Getters

  Object.defineProperty(this,'CardProp', {
  get: function() {
    return {
      suit: suit,
      number: number,
      color: color
    };
  }
  });

};


let JHearts = new card("heartsuit","J");

console.log(JHearts);

console.log("Printed");










// prototype method
// card.prototype.moveCard = function() {
//   // console.log("Moved Card");
//   this.xPos = this.xPos + 10;
//
//   if (this.xPos > 500) {
//     this.xPos = 10;
//   }
// };
