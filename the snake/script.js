class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        
        
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = [
            {x: 10, y: 10}
        ];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        
        this.init();
    }
    
    init() {
        this.highScoreElement.textContent = this.highScore;
        this.generateFood();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) {
                this.startGame();
            }
            this.changeDirection(e);
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        const W_KEY = 87;
        const A_KEY = 65;
        const S_KEY = 83;
        const D_KEY = 68;
        
        const keyPressed = event.keyCode;
        const goingUp = this.dy === -1;
        const goingDown = this.dy === 1;
        const goingRight = this.dx === 1;
        const goingLeft = this.dx === -1;
        
        if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {
            this.dx = -1;
            this.dy = 0;
        }
        
        if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
            this.dx = 0;
            this.dy = -1;
        }
        
        if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
            this.dx = 1;
            this.dy = 0;
        }
        
        if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
            this.dx = 0;
            this.dy = 1;
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameOverElement.style.display = 'none';
    }
    
    restartGame() {
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.gameRunning = false;
        this.gameOverElement.style.display = 'none';
        this.generateFood();
    }
    
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        
        // Make sure food doesn't spawn on snake
        for (let segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.generateFood();
                return;
            }
        }
    }
    
    drawGame() {
        this.clearCanvas();
        this.drawSnake();
        this.drawFood();
    }
    
    clearCanvas() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawSnake() {
        this.ctx.fillStyle = 'lime';
        for (let segment of this.snake) {
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        }
    }
    
    drawFood() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }
    
    moveSnake() {
        if (!this.gameRunning) return;
        
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        this.snake.unshift(head);
        
        const didEatFood = this.snake[0].x === this.food.x && this.snake[0].y === this.food.y;
        if (didEatFood) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    checkCollision() {
        if (!this.gameRunning) return false;
        
        const head = this.snake[0];
        
        // Wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // Self collision
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    gameOver() {
        this.gameRunning = false;
        this.finalScoreElement.textContent = this.score;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        this.gameOverElement.style.display = 'block';
    }
    
    gameLoop() {
        setTimeout(() => {
            this.moveSnake();
            
            if (this.checkCollision()) {
                this.gameOver();
            }
            
            this.drawGame();
            this.gameLoop();
        }, 100);
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});