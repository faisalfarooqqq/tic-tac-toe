document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.querySelector('.board');
    const cells = boardContainer.querySelectorAll('.cell');
    const startButton = document.getElementById('startGameButton');
    const messageBoard = document.querySelector('.message');
 


    const gameBoard = (() => {
        let board = ["", "", "", "", "", "", "", "", ""];

        const getBoard = () => board;

        const makeMove = (index, playerMarker) => {
            if (board[index] === "") {
                board[index] = playerMarker;
                return true;
            }
            return false;
        };

        const resetBoard = () => {
            for (let i = 0; i < board.length; i++) {
                board[i] = "";
            }
        };


        return {
            getBoard,
            makeMove,
            resetBoard,
        };
    })();

    const createPlayer = (name, marker) => {
        const playerName = name;
        const playerMarker = marker;

        const getName = () => playerName;
        const getMarker = () => playerMarker;

        return { getName, getMarker };
    }

    const displayController = (() => {
        const updateBoard = () => {
            const board = gameBoard.getBoard();
            for (let i = 0; i < board.length; i++) {
                cells[i].textContent = board[i];
            }
        };

        const showWinner = (winnerName) => {
           messageBoard.textContent = `${winnerName} wins!`;
        };

        const updateMessage = (text) => {
           messageBoard.textContent = text;
        };

        const resetBoard = () => {
            cells.forEach(cell => cell.textContent = "");
            messageBoard.textContent = "";
        };

        return {
            updateBoard,
            showWinner,
            updateMessage,
            resetBoard,
        };
    })();

    const gameController = (() => {
        const players = [];
        let currentPlayer;
        let gameOver = false;

        const winConditions = [
            [0, 1, 2], 
            [3, 4, 5], 
            [6, 7, 8], 
            [0, 3, 6], 
            [1, 4, 7], 
            [2, 5, 8], 
            [0, 4, 8], 
            [2, 4, 6]          
        ];
        
        const checkForWin = () => {
            const board = gameBoard.getBoard();
            
            for (let i = 0; i < winConditions.length; i++) {
                const condition = winConditions[i];
                const [a, b, c] = condition;
                
                if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }
        
            // Check for a draw
            if (board.every(cell => cell !== "")) {
                return 'draw';
            }
        
            return null;
        };

        const handlePlayerTurn = (index) => {
            if (!gameOver) {
                if (gameBoard.getBoard()[index] === '') {
                    gameBoard.makeMove(index, currentPlayer.getMarker());
                    displayController.updateBoard();
        
                    // Check for win or draw after updating the board and switching players
                    const result = checkForWin();
        
                    if (result === currentPlayer.getMarker()) {
                        gameOver = true;
                        displayController.showWinner(currentPlayer.getName());
                    } else if (result === 'draw') {
                        gameOver = true;
                        displayController.updateMessage("It's a draw!");
                    } else {
                        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
                        displayController.updateMessage(`It's ${currentPlayer.getName()}'s turn.`);
                    }
                }
            }
        };
        


        const startGame = () => {
            if (players.length === 0) {
                playerOneName = document.getElementById('playerOne').value;
                playerTwoName = document.getElementById('playerTwo').value;
                players.push(createPlayer(playerOneName, "X"));
                players.push(createPlayer(playerTwoName, "O"));
                currentPlayer = players[0];
            }
            gameOver = false;
            gameBoard.resetBoard();
            displayController.resetBoard();
            displayController.updateMessage(`It's ${currentPlayer.getName()}'s turn`);
        
            cells.forEach((cell, index) => {
                cell.addEventListener('click', () => {
                    console.log(cell.id);
                    handlePlayerTurn(index);
                });
            });
        };
        

        return {
            startGame,
        };
    })();

    startButton.addEventListener('click', () => {
        gameController.startGame();
    });
});
