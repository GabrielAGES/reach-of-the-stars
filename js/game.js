// game.js

// Retrieve the number of players from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const numPlayersParam = urlParams.get('players');
const boardSizeParam = urlParams.get('boardSize');
const topicParam = urlParams.get('topic');

// Define common game variables and functions

let boardSize = boardSizeParam ? parseInt(boardSizeParam) : 5; // Set default board size to 5
let currentPlayerIndex = 0;
let diceValue = null;
let playerTokens = []; // Array to store references to player token elements
let numPlayers = numPlayersParam ? parseInt(numPlayersParam) : 2;
let playerColors = ['steelblue', 'sienna', 'yellowgreen', 'violet'];
let diceRolls = Array(numPlayers).fill(0);
let playerNames = []; // Array to store player names
let correctAnswers = Array(numPlayers).fill(0);
playerPositions = new Array(numPlayers).fill(1);


initializeGame();

// Event listener for rolling dice
document.getElementById('dice').addEventListener('click', function() {
  // Ensure it's the current player's turn
    updateTurnInfo();
    rollDice();
    updateStats();
});
