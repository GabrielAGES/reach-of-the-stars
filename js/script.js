// Define a function to populate the topic dropdown with options
function populateTopics() {
  const topics = ["History", "Science", "Literature", "Geography"]; // Sample topics, you can update this array later
  const topicDropdown = document.getElementById('topic');
  topics.forEach(topic => {
    const option = document.createElement('option');
    option.value = topic.toLowerCase(); // Converting topic to lowercase for consistency
    option.textContent = topic;
    topicDropdown.appendChild(option);
  });
}

// Call the function to populate topics when the page loads
window.addEventListener('load', populateTopics);

// Function to handle single player mode
function singlePlayerMode() {
  const difficulty = document.getElementById('difficulty').value;
  const topic = document.getElementById('topic').value; // Get selected topic
  let boardSize;
  // Assign board size based on difficulty
  switch (difficulty) {
    case 'easy':
      boardSize = 5;
      break;
    case 'medium':
      boardSize = 7;
      break;
    case 'hard':
      boardSize = 10;
      break;
    default:
      boardSize = 5; // Default to easy if no valid selection
  }
  // Redirect to game.html with parameters
  window.location.href = `game.html?players=1&boardSize=${boardSize}&topic=${topic}`;
}

// Function to handle multiplayer mode
function multiPlayerMode() {
  const numPlayersInput = prompt("Enter the number of players (2-4):");
  const numPlayers = parseInt(numPlayersInput);
  if (numPlayers >= 2 && numPlayers <= 4) {
    const difficulty = document.getElementById('difficulty').value;
    const topic = document.getElementById('topic').value; // Get selected topic
    let boardSize;
    // Assign board size based on difficulty
    switch (difficulty) {
      case 'easy':
        boardSize = 5;
        break;
      case 'medium':
        boardSize = 7;
        break;
      case 'hard':
        boardSize = 10;
        break;
      default:
        boardSize = 5; // Default to easy if no valid selection
    }
    // Redirect to game.html with parameters
    window.location.href = `game.html?players=${numPlayers}&boardSize=${boardSize}&topic=${topic}`;
  } else {
    alert("Please enter a valid number of players (2-4).");
  }
}

// Event listeners for the buttons
document.getElementById('singlePlayer').addEventListener('click', singlePlayerMode);
document.getElementById('multiPlayer').addEventListener('click', multiPlayerMode);
