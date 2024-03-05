// utils.js

function displayPlayerNameModal() {
    const modal = document.getElementById('player-names-modal');
    modal.classList.remove('hidden');

    const submitButton = document.getElementById('player-name-submit');
    submitButton.addEventListener('click', function () {
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

// Function to start the game after all player names are entered
function startGame() {
    createBoard();
    updatePlayerColors();
    updateStats();
    updateTurnInfo();
}


// Initialize the game
function initializeGame() {
    console.log("Initializing game...");
    promptForPlayerNames();
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

// Function to display the winner modal
function displayWinnerModal(winnerName) {

    const modal = document.getElementById('winner-modal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
      <h2>${winnerName} wins!</h2>
      <a href="#" id="go-back-link">Go Back</a>
    `;

    const goBackLink = modalContent.querySelector('#go-back-link');
    goBackLink.addEventListener('click', function (event) {
        window.location.href = './index.html';
    });

    modal.style.display = 'block';
}
