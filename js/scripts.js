 //Business Logic for Die Sides
function dice() {
  this.diceSides = [];
}

dice.prototype.addDiceSide = function(diceSide) {
  this.diceSides.push(diceSide);
}

dice.prototype.findImage = function(sideNumber) {
  for (i=0; i < this.diceSides.length; i++) {
    if (this.diceSides[i]){
      if (this.diceSides[i].sideNum === sideNumber){
        return this.diceSides[i].imageURL;
      }
    }
  };
  return false;
}

// Business Logic for Images of Sides of a Die
function diceSide(sideNum, imageURL) {
    this.sideNum = sideNum,
    this.imageURL = imageURL
}

// Load die images

var diceImages = new dice();

var sides = ["images/side1.png", "images/side2.png", "images/side3.png",
             "images/side4.png", "images/side5.png", "images/side6.png"];

for (i=1; i<= 6; i++) {
  var side = new diceSide(i, sides[i-1]);
  diceImages.addDiceSide(side);
}

// Back-End Logic

var validateGuess = function (player1Guess, player2Guess) {
  if (player1Guess === player2Guess) {
    $("input#player2Guess").val("");
    alert("Player 2's Guess Cannot be the Same as Player 1's");
  }
}

var getFirstPlayer = function (player1Guess, player2Guess) {
  var roll = Math.floor((Math.random() * 6) + 1);
  console.log(roll);
  if (roll === player1Guess) {
    return 1;
  }
  else if (roll === player2Guess) {
    return 2;
  }
  else if (Math.abs(roll-player1Guess) === Math.abs(roll-player2Guess)) {
    return 1;
  }
  else if (Math.abs(roll-player1Guess) < Math.abs(roll-player2Guess)) {
    return 1;
  }
  else {
    return 2;
  }
}

var rollDice = function() {
  return Math.floor((Math.random() * 6) + 1);
}

var checkWinner = function(){
  if (points1 >= 10){
    var playerName = $("#player1").val();
    $("#winner").text(playerName);
    $("#startOfGame").hide();
    $("#gamePlay").hide();
    $("#winnerPage").show();
  }
  else if (points2 >= 10) {
    var playerName = $("#player2").val();
    $("#winner").text(playerName);
    $("#startOfGame").hide();
    $("#gamePlay").hide();
    $("#winnerPage").show();
  }
}

var playGame = function() {
  var roll = rollDice();
  var rollImage = diceImages.findImage(roll);
  $("#sideOfDie").html("<img src='" + rollImage + "'>");
  //currentPoints += roll;
  if (roll === 1) {
    currentPoints = 0;
    switchPlayer();
  }
  else {
    currentPoints = currentPoints + roll;
  }
  $("#currentPoints").text(currentPoints);
}

var switchPlayer = function() {
  if (turn === 1) {
    turn = 2;
  }
  else {
    turn = 1;
  }
  disableButtons();
  enableButtons();
}

var disableButtons = function() {
  if (turn === 1){
    document.getElementById("player2Roll").disabled = true;
    document.getElementById("player2Hold").disabled = true;

  }
  else {
    document.getElementById("player1Roll").disabled = true;
    document.getElementById("player1Hold").disabled = true;
  }
}

var enableButtons = function() {
  if (turn === 2){
    document.getElementById("player2Roll").disabled = false;
    document.getElementById("player2Hold").disabled = false;

  }
  else {
    document.getElementById("player1Roll").disabled = false;
    document.getElementById("player1Hold").disabled = false;
  }
}

var calculateScore = function() {
  if (turn === 1){
    points2 = currentPoints + points2;
    $("#player2Score").text(points2);
  }
  else {
    points1 = currentPoints + points1;
    $("#player1Score").text(points1);
  }
}

var holdSwitch = function(newTurn) {
  turn = newTurn;
  calculateScore();
  checkWinner();
  disableButtons();
  enableButtons();
  $("#currentPoints").text("0");
  currentPoints = 0;
}

var reMatch = function() {
    $("#gamePlay").show();
    $("#winnerPage").hide();
    $("#player1Score").text("0");
    $("#player2Score").text("0");
    $("#currentPoints").text("0");
    $("#sideOfDie").empty();
    currentPoints = 0;
    points1 = 0;
    points2 = 0;
}

var currentPoints = 0;
var points1 = 0;
var points2 = 0;
var turn = 0;

function attachButtonListeners(){
  $("#button1").on("click", "#player1Roll", function(){
    playGame();
  });
  $("#button2").on("click", "#player2Roll", function(){
    playGame();
  });
  $("#button1").on("click", "#player1Hold", function(){
    holdSwitch(2);
  });
  $("#button2").on("click", "#player2Hold", function(){
    holdSwitch(1);
  });
  $("#button3").on("click", "#rematch", function(){
    reMatch();
  });
  $("#button3").on("click", "#mainMenu", function(){
    location.reload();
  });
};

$(document).ready(function() {
  attachButtonListeners();
  $("form#playGame").submit(function(event) {
    event.preventDefault();

    inputtedPlayer1 = $("input#player1").val();
    inputtedPlayer2 = $("input#player2").val();
    inputtedPlayer1Guess = $("input#player1Guess").val();
    inputtedPlayer2Guess = $("input#player2Guess").val();

    $("#player1Name").empty().text(inputtedPlayer1);
    $("#player2Name").empty().text(inputtedPlayer2);

    $("#player1Score").text("0");
    $("#player2Score").text("0");

    validateGuess(inputtedPlayer1Guess, inputtedPlayer2Guess);

    turn = getFirstPlayer(inputtedPlayer1Guess, inputtedPlayer2Guess);
    disableButtons();
    $("#startOfGame").hide();
    $("#gamePlay").show();
  });
});
