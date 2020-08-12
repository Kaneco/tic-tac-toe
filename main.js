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
const player1 = playerFactory("Player1", "X");
const player2 = playerFactory("Player2", "O");

// Board Operations and Methods
const gameBoard = (() => {
	// var board = new Array(9); //Creates board to store player positions
	let board = ["X", "X", "O", "", "X", "O", "", "", "X"];

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

	let currentPlayer = player1; // Start game always with player 1

	// Toggles current player after a play
	const toggleCurrentPlayer = () => {
		if (currentPlayer == player1) {
			currentPlayer = player2;
		} else {
			currentPlayer = player1;
		}
	};

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
			})
		})
	};

	function gameLogic(position) {
		// Check if play is possible
		if (makePlay(position, currentPlayer)) {
			// Check if the play made resulted in win
			winningArray = checkIfWinner(currentPlayer.sign);
			if (Array.isArray(winningArray)) {
				return winningArray;
			}
			// If no winner, check for TIE (in case board is full)
			else if (gameBoard.checkIfBoardFull()) {
				return "TIE";
			}
			toggleCurrentPlayer(); // Toggles Current Player if Play is Sucessfull
		} else {
			// Play not sucessful
			return false;
		}
	}

	return {
		toggleCurrentPlayer,
		getCurrentPlayer,
		makePlay,
		checkIfWinner,
		gameLogic,
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
		}
	}

	document
		.getElementById("game-board")
		.addEventListener("click", function (event) {
			//Game Board Event Listeners
			if (event.target.classList.contains("positions")) {
                let position = event.target.id.slice(-1);
                resultOfPlay = gameFlow.gameLogic(position);
				if (Array.isArray(resultOfPlay)){ // In case of WIN

                }
                else if (resultOfPlay == "TIE") {
                    // In case of TIE
                }

                
				render();
			}
		});
	return { render, resetRenderBoard }
})();
