let score = 0;
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');

// Add click event listener
gameArea.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    
    // Add a visual effect when clicking
    gameArea.style.transform = 'scale(0.95)';
    setTimeout(() => {
        gameArea.style.transform = 'scale(1)';
    }, 100);
});
