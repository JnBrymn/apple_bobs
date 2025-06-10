class CheckersGame {
    constructor() {
        this.board = [];
        this.selectedPiece = null;
        this.currentPlayer = 'black'; // Player is black, AI is red
        this.validMoves = [];
        this.multipleJumps = false;
        this.initializeBoard();
        this.setupEventListeners();
        this.updateStatus();
    }

    initializeBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                boardElement.appendChild(square);

                // Initialize pieces
                if ((row + col) % 2 === 1) {
                    if (row < 3) {
                        this.board[row][col] = 'red';
                        this.createPiece(square, 'red');
                    } else if (row > 4) {
                        this.board[row][col] = 'black';
                        this.createPiece(square, 'black');
                    } else {
                        this.board[row][col] = null;
                    }
                } else {
                    this.board[row][col] = null;
                }
            }
        }
    }

    createPiece(square, color) {
        const piece = document.createElement('div');
        piece.className = `piece ${color}`;
        square.appendChild(piece);
    }

    setupEventListeners() {
        document.getElementById('board').addEventListener('click', (e) => {
            const square = e.target.closest('.square');
            if (!square) return;

            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);

            if (this.currentPlayer === 'black') {
                this.handlePlayerMove(row, col);
            }
        });

        document.getElementById('new-game').addEventListener('click', () => {
            this.initializeBoard();
            this.currentPlayer = 'black';
            this.selectedPiece = null;
            this.validMoves = [];
            this.updateStatus();
        });
    }

    handlePlayerMove(row, col) {
        if (this.selectedPiece) {
            if (this.validMoves.some(move => move.row === row && move.col === col)) {
                const move = this.validMoves.find(move => move.row === row && move.col === col);
                this.movePiece(this.selectedPiece, row, col);
                
                // Check for additional jumps
                if (move.isJump) {
                    const newMoves = this.getValidMoves(row, col);
                    const additionalJumps = newMoves.filter(m => m.isJump);
                    
                    if (additionalJumps.length > 0) {
                        this.multipleJumps = true;
                        this.selectedPiece = { row, col };
                        this.validMoves = additionalJumps;
                        this.highlightValidMoves();
                        return;
                    }
                }
                
                this.clearSelection();
                this.multipleJumps = false;
                this.currentPlayer = 'red';
                this.updateStatus();
                setTimeout(() => this.makeAIMove(), 500);
            } else {
                this.clearSelection();
                this.multipleJumps = false;
                this.selectPiece(row, col);
            }
        } else {
            this.selectPiece(row, col);
        }
    }

    selectPiece(row, col) {
        if (this.board[row][col] === this.currentPlayer) {
            this.selectedPiece = { row, col };
            this.validMoves = this.getValidMoves(row, col);
            this.highlightValidMoves();
        }
    }

    clearSelection() {
        this.selectedPiece = null;
        this.validMoves = [];
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('selected', 'valid-move');
        });
    }

    getValidMoves(row, col) {
        const moves = [];
        const piece = this.board[row][col];
        const isKing = document.querySelector(`[data-row="${row}"][data-col="${col}"] .piece`)?.classList.contains('king');
        
        // Kings can move in both directions, regular pieces only forward
        const directions = isKing ? [-1, 1] : (piece === 'black' ? [-1] : [1]);

        // Check for jumps
        for (const dir of directions) {
            for (const colDir of [-1, 1]) {
                const jumpRow = row + (dir * 2);
                const jumpCol = col + (colDir * 2);
                const midRow = row + dir;
                const midCol = col + colDir;

                if (this.isValidJump(row, col, jumpRow, jumpCol, midRow, midCol)) {
                    moves.push({ row: jumpRow, col: jumpCol, isJump: true });
                }
            }
        }

        // If no jumps available and not in the middle of multiple jumps, check for regular moves
        if (moves.length === 0 && !this.multipleJumps) {
            for (const dir of directions) {
                for (const colDir of [-1, 1]) {
                    const newRow = row + dir;
                    const newCol = col + colDir;

                    if (this.isValidMove(row, col, newRow, newCol)) {
                        moves.push({ row: newRow, col: newCol, isJump: false });
                    }
                }
            }
        }

        return moves;
    }

    isValidJump(fromRow, fromCol, toRow, toCol, midRow, midCol) {
        if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
        if (this.board[toRow][toCol] !== null) return false;
        if (this.board[midRow][midCol] === this.currentPlayer) return false;
        if (this.board[midRow][midCol] === null) return false;
        return true;
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
        return this.board[toRow][toCol] === null;
    }

    highlightValidMoves() {
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('selected', 'valid-move');
        });

        const selectedSquare = document.querySelector(`[data-row="${this.selectedPiece.row}"][data-col="${this.selectedPiece.col}"]`);
        selectedSquare.classList.add('selected');

        this.validMoves.forEach(move => {
            const square = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
            square.classList.add('valid-move');
        });
    }

    movePiece(from, toRow, toCol) {
        const fromSquare = document.querySelector(`[data-row="${from.row}"][data-col="${from.col}"]`);
        const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
        const piece = fromSquare.querySelector('.piece');

        // Handle jumps
        if (Math.abs(toRow - from.row) === 2) {
            const midRow = (from.row + toRow) / 2;
            const midCol = (from.col + toCol) / 2;
            this.board[midRow][midCol] = null;
            const midSquare = document.querySelector(`[data-row="${midRow}"][data-col="${midCol}"]`);
            midSquare.innerHTML = '';
        }

        // Move the piece
        this.board[toRow][toCol] = this.board[from.row][from.col];
        this.board[from.row][from.col] = null;
        fromSquare.innerHTML = '';
        toSquare.appendChild(piece);

        // Check for king
        if ((toRow === 0 && this.board[toRow][toCol] === 'black') ||
            (toRow === 7 && this.board[toRow][toCol] === 'red')) {
            piece.classList.add('king');
        }
    }

    makeAIMove() {
        const moves = this.getAllValidMoves('red');
        if (moves.length === 0) {
            this.updateStatus('Game Over - You Win!');
            return;
        }

        // Prioritize jumps
        const jumps = moves.filter(move => move.isJump);
        let move;
        
        if (jumps.length > 0) {
            // Find the jump sequence with the most captures
            let bestJump = jumps[0];
            let maxCaptures = 0;
            
            for (const jump of jumps) {
                const captures = this.countCapturesInJump(jump);
                if (captures > maxCaptures) {
                    maxCaptures = captures;
                    bestJump = jump;
                }
            }
            
            move = bestJump;
        } else {
            move = moves[Math.floor(Math.random() * moves.length)];
        }

        // Make the move
        this.movePiece({ row: move.fromRow, col: move.fromCol }, move.row, move.col);
        
        // Check for additional jumps
        const newMoves = this.getValidMoves(move.row, move.col);
        const additionalJumps = newMoves.filter(m => m.isJump);
        
        if (additionalJumps.length > 0) {
            // Continue with multiple jumps
            setTimeout(() => {
                this.selectedPiece = { row: move.row, col: move.col };
                this.validMoves = additionalJumps;
                this.makeAIMove();
            }, 500);
        } else {
            // End AI turn
            this.currentPlayer = 'black';
            this.updateStatus();
            
            // Check for game over
            if (this.getAllValidMoves('black').length === 0) {
                this.updateStatus('Game Over - AI Wins!');
            }
        }
    }

    countCapturesInJump(move) {
        let captures = 1;
        let currentRow = move.fromRow;
        let currentCol = move.fromCol;
        let targetRow = move.row;
        let targetCol = move.col;
        
        while (true) {
            const midRow = (currentRow + targetRow) / 2;
            const midCol = (currentCol + targetCol) / 2;
            
            if (this.board[midRow][midCol] !== null) {
                captures++;
            }
            
            const newMoves = this.getValidMoves(targetRow, targetCol);
            const nextJump = newMoves.find(m => m.isJump);
            
            if (!nextJump) break;
            
            currentRow = targetRow;
            currentCol = targetCol;
            targetRow = nextJump.row;
            targetCol = nextJump.col;
        }
        
        return captures;
    }

    getAllValidMoves(color) {
        const moves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === color) {
                    const validMoves = this.getValidMoves(row, col);
                    validMoves.forEach(move => {
                        moves.push({
                            fromRow: row,
                            fromCol: col,
                            ...move
                        });
                    });
                }
            }
        }
        return moves;
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (message) {
            statusElement.textContent = message;
        } else {
            statusElement.textContent = `Current Turn: ${this.currentPlayer === 'black' ? 'Your turn (Black)' : 'AI\'s turn (Red)'}`;
        }
    }
}

// Start the game
const game = new CheckersGame(); 