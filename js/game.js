// Retrieve the number of players from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const numPlayersParam = urlParams.get('players');
const boardSizeParam = urlParams.get('boardSize');
const topicParam = urlParams.get('topic');

console.log(topicParam);

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


// Function to create the game board
function createBoard() {
  const board = document.getElementById('board');
  const cellWidth = 500 / boardSize;
  board.style.gridTemplateColumns = `repeat(${boardSize}, ${cellWidth}px)`;
  board.style.gridTemplateRows = `repeat(${boardSize}, ${cellWidth}px)`;

  for (let i = boardSize * boardSize; i > 0; i--) {
    const box = document.createElement('div');
    box.classList.add('box');
    box.textContent = i;
    box.setAttribute('data-position', i);

    if (i === 1) {
      for (let j = 0; j < numPlayers; j++) {
        const playerToken = document.createElement('div');
        playerToken.classList.add('player');
        playerToken.style.backgroundColor = playerColors[j];
        box.appendChild(playerToken);
        playerTokens.push(playerToken); // Store reference to player token
        const playerName = document.createElement('div');
        //playerName.textContent = playerNames[j] || `Player ${j + 1}`;
        playerName.classList.add('player-name');
        box.appendChild(playerName);
      }
    }

    board.appendChild(box);
  }
}

function displayPlayerNameModal() {
  const modal = document.getElementById('player-names-modal');
  modal.classList.remove('hidden');

  const closeButton = modal.querySelector('.close');
  closeButton.addEventListener('click', function() {
    modal.classList.add('hidden');
  });

  const submitButton = document.getElementById('player-name-submit');
  submitButton.addEventListener('click', function() {
    const nameInputs = document.querySelectorAll('.player-name-input');
    nameInputs.forEach((input, index) => {
      const playerName = input.value.trim();
      if (playerName !== '') {
        playerNames[index] = playerName;
      } else {
        alert(`Please enter a name for Player ${index + 1}.`);
        return; // Exit the function if any input is empty
      }
    });
    modal.classList.add('hidden'); // Close the modal after all names are entered
    startGame(); // Start the game
  });
}


// Function to prompt for player names
function promptForPlayerNames() {
  displayPlayerNameModal();

  const inputContainer = document.getElementById('player-name-inputs');
  for (let i = 0; i < numPlayers; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Player ${i + 1}'s name`;
    input.classList.add('player-name-input');
    inputContainer.appendChild(input);
  }
}


// Function to move the player forward
function moveForward(steps) {
  const currentPlayerToken = document.querySelector(`.box[data-position="${playerPositions[currentPlayerIndex]}"] .player`);
  let currentPosition = playerPositions[currentPlayerIndex];
  let newPosition = currentPosition + steps;

  // Ensure newPosition does not exceed the boardSize
  newPosition = Math.min(newPosition, boardSize * boardSize);

  // Define animation parameters
  const animationInterval = 200; // Interval between each animation step in milliseconds
  let animationStep = 0;

  // Function to perform the animation step by step
  function performAnimation() {
    const intervalId = setInterval(() => {
      animationStep++;

      // Calculate the next position
      let nextPosition = currentPosition + animationStep;

      // Move the player token to the next position if it exists and it's not the same as the current position
      if (nextPosition !== currentPosition) {
        const nextBox = document.querySelector(`.box[data-position="${nextPosition}"]`);
        if (nextBox && currentPlayerToken) {
          // Remove the player token from its current position
          currentPlayerToken.remove();
          // Append the player token to the next position
          nextBox.appendChild(currentPlayerToken);
        }
      }

      // Check if the animation is complete
      if (nextPosition >= newPosition) {
        clearInterval(intervalId); // Stop the animation

        // Update playerPositions after completing the move
        playerPositions[currentPlayerIndex] = newPosition;

        // Update stats after completing the move
        updateStats();

        // Update turn info after completing the move
        updateTurnInfo();

        // Prompt question upon reaching the destination
        displayQuestion(topicParam);
      }
    }, animationInterval);
  }

  // Perform the animation
  performAnimation();
}

function moveBackwards(steps) {
  // Ensure the current player's position is valid
  if (playerPositions[currentPlayerIndex] - steps > 0) {
    // Decrement the current player's position by the specified steps
    playerPositions[currentPlayerIndex] -= steps;
  } else {
    // If moving backwards would go beyond the start, set position to 1
    playerPositions[currentPlayerIndex] = 1;
  }

  // Update the player's position on the board
  updatePlayerPosition();
}

function updatePlayerPosition() {
  const currentPosition = playerPositions[currentPlayerIndex];
  const currentBox = document.querySelector(`[data-position="${currentPosition}"]`);

  // Remove the player token from its current position
  playerTokens[currentPlayerIndex].remove();

  // Append the player token to the new position
  currentBox.appendChild(playerTokens[currentPlayerIndex]);

  // Update stats after moving
  updateStats();
}


// Function to display the question modal
function displayQuestionModal() {
  const modal = document.getElementById('question-modal');
  modal.classList.remove('hidden');

  const closeButton = document.querySelector("#question-modal .close");
  closeButton.addEventListener('click', function() {
    modal.classList.add('hidden');
  });
}

let currentQuestionIndex; // Define a variable to keep track of the current question index
// Function to display question and answer choices
function displayQuestion(topic) {
  displayQuestionModal();
  
  // Filter questions based on the selected topic
  const filteredQuestions = questions.filter(q => q.topic === topic);
  
  // Select a random question from the filtered list
  currentQuestionIndex = Math.floor(Math.random() * filteredQuestions.length);
  const questionData = filteredQuestions[currentQuestionIndex];
  const { question, answers } = questionData;

  document.getElementById('question').textContent = question;

  const answersContainer = document.getElementById('answers');
  answersContainer.innerHTML = ''; // Clear previous answers

  // Display answer choices with buttons
  answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.textContent = `${String.fromCharCode(97 + index)}. ${answer}`;
    button.addEventListener('click', function() {
      handleAnswerSelection(index);
    });
    answersContainer.appendChild(button);
  });
}


// Function to update the turn info text
function updateTurnInfo() {
  const turnInfo = document.getElementById('turn-info');
  turnInfo.textContent = `${playerNames[currentPlayerIndex]}'s turn`;
}

// Update player colors list
function updatePlayerColors() {
  const colorsContainer = document.getElementById('player-colors');
  colorsContainer.innerHTML = ''; // Clear previous colors

  for (let i = 0; i < numPlayers; i++) {
    // Create container div for player color and name
    const playerContainer = document.createElement('div');
    playerContainer.classList.add('color-container');

    // Create color box
    const colorBox = document.createElement('div');
    colorBox.style.backgroundColor = playerColors[i];
    colorBox.style.width = '20px';
    colorBox.style.height = '20px';
    colorBox.style.display = 'inline-block';
    colorBox.style.marginRight = '5px';

    // Create span for player name
    const colorText = document.createElement('span');
    colorText.textContent = playerNames[i];

    // Append color box and name to container
    playerContainer.appendChild(colorBox);
    playerContainer.appendChild(colorText);

    // Append container to colorsContainer
    colorsContainer.appendChild(playerContainer);

    if (i < numPlayers - 1) {
      colorsContainer.appendChild(document.createElement('br')); // Add line break after each player
    }
  }
}


// Update statistics display
function updateStats() {
  const statsContainer = document.getElementById('player-stats');
  statsContainer.innerHTML = ''; // Clear previous stats

  // Create table element
  const table = document.createElement('table');

  // Create table header row
  const headerRow = document.createElement('tr');
  const headers = ['Name', 'Rolls', 'Cell', 'Correct Answers'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });
  table.appendChild(headerRow);

  // Populate table with player stats
  for (let i = 0; i < numPlayers; i++) {
    const playerRow = document.createElement('tr');
    const playerNameCell = document.createElement('td');
    playerNameCell.textContent = playerNames[i];
    const rollsCell = document.createElement('td');
    rollsCell.textContent = diceRolls[i];
    const cellCell = document.createElement('td');
    cellCell.textContent = playerPositions[i]; // Update cell position
    const correctAnswersCell = document.createElement('td');
    correctAnswersCell.textContent = correctAnswers[i]; // Display correct answers count

    // Append cells to player row
    playerRow.appendChild(playerNameCell);
    playerRow.appendChild(rollsCell);
    playerRow.appendChild(cellCell);
    playerRow.appendChild(correctAnswersCell);

    // Append player row to table
    table.appendChild(playerRow);
  }

  // Append table to stats container
  statsContainer.appendChild(table);
}

function handleAnswerSelection(index) {
  const modal = document.getElementById('question-modal');
  const questionData = questions[currentQuestionIndex];
  const correctAnswer = questionData.correctAnswer;
  const selectedAnswer = questionData.answers[index];
  const answerResult = document.createElement('p');
  answerResult.classList.add('answer-result'); // Add class for styling

  if (selectedAnswer === correctAnswer) {
    answerResult.textContent = 'Correct!';
  } else {
    answerResult.textContent = 'Wrong!';
    const penaltyTypes = ['stepBackOne', 'stepBackThree', 'backToStart'];
    let availablePenalties = penaltyTypes.slice(); // Create a copy of available penalties

    // Remove the previous penalty from available options (if it exists)
    if (previousPenalty) {
      const penaltyIndex = availablePenalties.indexOf(previousPenalty);
      if (penaltyIndex !== -1) {
        availablePenalties.splice(penaltyIndex, 1);
      }
    }

    // Randomly select a penalty from the remaining options
    const randomPenalty = availablePenalties[Math.floor(Math.random() * availablePenalties.length)];
    previousPenalty = randomPenalty; // Store the selected penalty for next turn

    switch (randomPenalty) {
      case 'stepBackOne':
        moveBackwards(1);
        break;
      case 'stepBackThree':
        moveBackwards(3);
        break;
      case 'backToStart':
        moveBackwards(boardSize * boardSize - 1); // Move back to the first cell (position 1)
        break;
    }
  }

  modal.appendChild(answerResult); // Append answer result inside the modal

  setTimeout(() => {
    modal.removeChild(answerResult); // Remove the answer result after a delay
    modal.classList.add('hidden');
  }, 1500);

  if (selectedAnswer === correctAnswer) {
    correctAnswers[currentPlayerIndex]++;
  }

  updateStats();
  currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
  updateTurnInfo();
}

// Add a variable to track the previously applied penalty
let previousPenalty = null; // Initialize as null


// Function to roll the dice and start the game
function rollDice() {
  // Roll the dice
  diceValue = Math.floor(Math.random() * 6) + 1;

  // Increment the dice roll count for the current player
  diceRolls[currentPlayerIndex]++;

  // Set the dice number
  document.getElementById('dice').textContent = diceValue;

  // Add animation class
  document.getElementById('dice').classList.add('flip-animation');

  // Move the player token after the animation completes
  setTimeout(() => {
    moveForward(diceValue);

    // Remove animation class
    document.getElementById('dice').classList.remove('flip-animation');
  }, 1000); // Adjust delay to match animation duration
}


// Event listener for rolling dice
document.getElementById('dice').addEventListener('click', function() {
  // Ensure it's the current player's turn
    updateTurnInfo();
    rollDice();
    updateStats();
});


// Function to start the game after all player names are entered
function startGame() {
  createBoard();
  updatePlayerColors();
  updateStats();
  updateTurnInfo();
}

// Initialize the game board
playerPositions = new Array(numPlayers).fill(1);
// Call the function to load questions when the script runs

// Initialize the game
function initializeGame() {
  console.log("Initializing game...");
  promptForPlayerNames();
}

initializeGame();
