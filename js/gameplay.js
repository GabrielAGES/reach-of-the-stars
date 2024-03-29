// gameplay.js

// Function to display the question modal
function displayQuestionModal() {
    const modal = document.getElementById('question-modal');
    modal.classList.remove('hidden');

}

// Define a variable to keep track of the current question index
let currentQuestionIndex;
// Array to store indices of used questions
let usedQuestionIndices = [];

// Function to display question and answer choices
function displayQuestion(topic) {
    displayQuestionModal();

    // Filter questions based on the selected topic
    const filteredQuestions = questions.filter(q => q.topic === topic);

    // If all questions have been used, reset the usedQuestionIndices array
    if (usedQuestionIndices.length === filteredQuestions.length) {
        usedQuestionIndices = [];
    }

    // Select a random unused question from the filtered list
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    } while (usedQuestionIndices.includes(randomIndex));

    currentQuestionIndex = randomIndex;
    usedQuestionIndices.push(randomIndex);

    const questionData = filteredQuestions[currentQuestionIndex];
    const { question, answers } = questionData;

    document.getElementById('question').textContent = question;

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = ''; // Clear previous answers

    // Display answer choices with buttons
    answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = `${String.fromCharCode(97 + index)}. ${answer}`;
        button.addEventListener('click', function () {
            handleAnswerSelection(index);
        });
        answersContainer.appendChild(button);
    });
}

// Add a variable to track the previously applied penalty
let previousPenalty = null; // Initialize as null
function handleAnswerSelection(index) {
    const modal = document.getElementById('question-modal');
    const questionData = questions[currentQuestionIndex];
    const correctAnswer = questionData.correctAnswer;
    const selectedAnswer = questionData.answers[index];
    const answerResult = document.createElement('p');
    answerResult.classList.add('answer-result'); // Add class for styling

    if (selectedAnswer === correctAnswer) {
        answerResult.textContent = 'Correct!';
        correctAnswers[currentPlayerIndex]++;

        // Check if the player reached the last cell
        const currentPosition = playerPositions[currentPlayerIndex];
        if (currentPosition === boardSize * boardSize) {
            // Display the winner modal if the player answered the last question correctly
            displayWinnerModal(playerNames[currentPlayerIndex]);
            return; // Exit the function after displaying the winner modal
        }
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

    updateStats();
    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
    updateTurnInfo();
}