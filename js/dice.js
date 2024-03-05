// dice.js

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