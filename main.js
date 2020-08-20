let player1;
let player2;

// Creates Players
const playerFactory = (name, sign) => {
	let score = 0;

	// increases score on Win
	const increaseScore = () => {
		score += 1;
	};

	// gets player score
	const getScore = () => {
		return score;
	};
	return { name, sign, getScore, increaseScore };
};

// Players Created
//const player1 = playerFactory("Player1", "X");
//const player2 = playerFactory("Player2", "O");

// Board Operations and Methods
const gameBoard = (() => {
	let board = new Array(9); //Creates board to store player positions
	//let board = ["X", "X", "O", "", "X", "O", "", "", "X"];

	function changeBoardPosition(position, currentPlayerSign) {
		//Update play made to the board
		board[position] = currentPlayerSign;
	}

	// Resets Board for game restart
	function resetBoard() {
		board = new Array(9);
	}

	//Check if given position is Empty
	function checkIfEmpty(position) {
		const element = board[position];
		if (element == null || element == undefined || element == "") {
			return true;
		} else {
			return false;
		}
	}

	// Check if board is full, Return True if so
	function checkIfBoardFull() {
		for (let index = 0; index < board.length; index++) {
			if (checkIfEmpty(index)) {
				return false;
			}
		}
		return true;
	}

	//Get Position from Board
	function getPosition(position) {
		return board[position];
	}

	return {
		changeBoardPosition,
		checkIfEmpty,
		getPosition,
		checkIfBoardFull,
		resetBoard,
	};
})();

// Board Operations and Methods
const gameFlow = (() => {
	let winningMoves = [
		//Possible Winning Moves Array
		[0, 1, 2], // Line Wins
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6], // Column Wins
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8], // Diagonal Wins
		[2, 4, 6],
	];

	let gameOngoing = true; // Game is still ongoing
	let currentPlayer = player1; // Start game always with player 1

	// Toggles current player after a play
	const toggleCurrentPlayer = () => {
		if (currentPlayer == player1) {
			currentPlayer = player2;
		} else {
			currentPlayer = player1;
		}
	};

	//Reset game state to defaults after a game over
	function resetGameState() {
		gameOngoing = true;
		currentPlayer = player1;
	}

	// Get Current Player
	const getCurrentPlayer = () => currentPlayer;

	// Check if a play is possible (position is emtpy), make a play and add it to the board array and to the plays array stored for each player
	function makePlay(position, currentPlayer) {
		if (gameBoard.checkIfEmpty(position)) {
			gameBoard.changeBoardPosition(position, currentPlayer.sign);
			return true;
		} else {
			return false;
		}
	}

	// Check if a given player sign is a winner
	function checkIfWinner(playerSign) {
		// Sign on the board has to match every winning combination of the same array
		return winningMoves.find((winningCombinaton) => {
			return winningCombinaton.every((position) => {
				return gameBoard.getPosition(position) == playerSign;
			});
		});
	}

	function gameLogic(position) {
		if (gameOngoing) {
			// Check if play is possible
			if (makePlay(position, currentPlayer)) {
				// Check if the play made resulted in win
				winningArray = checkIfWinner(currentPlayer.sign);
				if (Array.isArray(winningArray)) {
					gameOngoing = false;
					return winningArray;
				}
				// If no winner, check for TIE (in case board is full)
				else if (gameBoard.checkIfBoardFull()) {
					gameOngoing = false;
					return "TIE";
				}
				toggleCurrentPlayer(); // Toggles Current Player if Play is Sucessfull
			} else {
				// Play not sucessful
				return false;
			}
		}
		return false;
	}

	return {
		toggleCurrentPlayer,
		getCurrentPlayer,
		makePlay,
		checkIfWinner,
		gameLogic,
		resetGameState,
	};
})();

// Info displayed on screen
const screenDisplay = (() => {
	function render() {
		// renders positions played from the Array to the HTML page, only renders new positions played.
		let boardPositions = document.getElementsByClassName("positions");
		for (let position of boardPositions) {
			let oSignImage = document.createElement("img");
			let xSignImage = document.createElement("img");
			oSignImage.src = "/images/osign.png";
			xSignImage.src = "/images/xsign.png";
			oSignImage.className = "bounce-in-fwd";
			xSignImage.className = "bounce-in-fwd";
			if (!position.classList.contains("played")) {
				// only adds new plays, not already stored plays
				arrayStoredPosition = gameBoard.getPosition(position.id.slice(-1)); // Get Position from the Array that corresponds to the position ID of the element we are checking
				switch (arrayStoredPosition) {
					case "X":
						position.appendChild(xSignImage);
						position.classList.add("played");
						break;
					case "O":
						position.appendChild(oSignImage);
						position.classList.add("played");
						break;
					default:
						break;
				}
			}
		}
	}

	function resetRenderBoard() {
		// Resets the rendered Board (for a new game)
		let boardPositions = document.getElementsByClassName("positions");
		for (let position of boardPositions) {
			position.innerHTML = "";
			position.classList.remove("played");
			position.classList.remove("winner-position");
		}
	}

	const triggerWinner = (winningCombination) => {};

	// Restart game, resets game state and board
	document
		.getElementById("restart-game")
		.addEventListener("click", function (event) {
			resetRenderBoard();
			gameBoard.resetBoard();
			gameFlow.resetGameState();
		});

	// submits names
	document
		.getElementById("submit-btn")
		.addEventListener("click", function (event) {
            let p1name = document.getElementById("player1").value;
            let p2name = document.getElementById("player2").value;
            player1 = playerFactory(p1name, "X");
            player2 = playerFactory(p2name, "O");
            console.log(p1name);
            console.log(player1);
            document.getElementById("game-board").style.opacity = 1;
            document.getElementById("player-names").style.display = "none";
            document.getElementById("player-info").style.display = "flex";
            resetRenderBoard();
			gameBoard.resetBoard();
            gameFlow.resetGameState();

		});

	document
		.getElementById("game-board")
		.addEventListener("click", function (event) {
			//Game Board Event Listeners
			if (event.target.classList.contains("positions")) {
				let position = event.target.id.slice(-1);
				resultOfPlay = gameFlow.gameLogic(position);
				if (Array.isArray(resultOfPlay)) {
					// In case of WIN
					console.log(resultOfPlay + gameFlow.getCurrentPlayer().name);
					render();
					// Highlights winning plays
					document
						.getElementById(`position-${resultOfPlay[0]}`)
						.classList.add("winner-position");
					document
						.getElementById(`position-${resultOfPlay[1]}`)
						.classList.add("winner-position");
					document
						.getElementById(`position-${resultOfPlay[2]}`)
						.classList.add("winner-position");
				} else if (resultOfPlay == "TIE") {
					render();
					// In case of TIE
				} else {
					render();
				}
			}
		});

	return { render, resetRenderBoard };
})();
