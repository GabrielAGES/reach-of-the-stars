// board.js

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

                // Check if the player reached the last cell
                newPosition = currentPosition + steps;
                if (newPosition === boardSize * boardSize) {
                    displayWinnerModal(playerNames[currentPlayerIndex]);
                }
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
