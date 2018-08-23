// function card(tempSuit,tempNumber) {
//
//   this.played = false;
//   this.selected = false;
//
//   const suit = tempSuit;
//   const number = tempNumber;
//
//   let tempcolor;
//
//   // Set Color
//   if (suit == "spadessuit" || suit == "clubsuit"  ||  suit == "blackjoker") {
//     tempcolor = "black";
//   } else if (suit == "heartsuit" || suit == "diamondsuit" ||  suit == "redjoker") {
//     tempcolor = "red";
//   } else {
//     tempcolor = "notset";
//   }
//
//   const color = tempcolor;
//
// // Getter
//
//
//   Object.defineProperty(this,'CardProperties', {
//   get: function() {
//     return {
//       suit: suit,
//       number: number,
//       color: color
//     };
//   }
//   });
//
// };
//
//
// exports.generateDeck = function() {
//   var cardDeck = [];
//   var suitsArray = ['heartsuit','spadessuit','diamondsuit','clubsuit'];
//
//   for (var i in suitsArray) {
//     for (var j = 1; j <= 13; j++) {
//       cardDeck.push(new card(suitsArray[i], j));
//     };
//   };
//
//   cardDeck.push(new card('redjoker',14));
//   cardDeck.push(new card('blackjoker',14));
//
//   if (cardDeck.length == 54) {
//     return cardDeck;
//   } else {
//     throw new Error("Expecting length 54, but deck length is: " + cardDeck.length);
//   }
// };
//
// exports.shuffle = function(array) {
//     let counter = array.length;
//
//     // While there are elements in the array
//     while (counter > 0) {
//         // Pick a random index
//         let index = Math.floor(Math.random() * counter);
//
//         // Decrease counter by 1
//         counter--;
//
//         // And swap the last element with it
//         let temp = array[counter];
//         array[counter] = array[index];
//         array[index] = temp;
//     }
//
//     return array;
// }
//
//
//
//
//
//
// // prototype method
// // card.prototype.moveCard = function() {
// //   // console.log("Moved Card");
// //   this.xPos = this.xPos + 10;
// //
// //   if (this.xPos > 500) {
// //     this.xPos = 10;
// //   }
// // };
