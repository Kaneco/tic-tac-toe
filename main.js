//initialize both players
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

// Board Operations and Methods
const gameBoard = (() => {
	let board = new Array(9); //Creates board to store player positions

	//Update play made to the board
	function changeBoardPosition(position, currentPlayerSign) {
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

	let gameOngoing = false; // Game starts inactive
	let currentPlayer = player1; // Start game always with player 1

	// Toggles current player after a play
	const _toggleCurrentPlayer = () => {
		if (currentPlayer == player1) {
			currentPlayer = player2;
		} else {
			currentPlayer = player1;
		}
	};

	//disables the game while on other menus of buttons (not playing)
	function disableGame() {
		gameOngoing = false;
	}

	// Get current game state
	function getGameState() {
		return gameOngoing;
	}

	//Reset game state to defaults after a game over
	function resetGameState() {
		gameOngoing = true;
		currentPlayer = player1;
	}

	// Get Current Player
	const getCurrentPlayer = () => currentPlayer;

	// Check if a play is possible (position is emtpy), make a play and add it to the board array and to the plays array stored for each player
	function _makePlay(position, currentPlayer) {
		if (gameBoard.checkIfEmpty(position)) {
			gameBoard.changeBoardPosition(position, currentPlayer.sign);
			return true;
		} else {
			return false;
		}
	}

	// Check if a given player sign is a winner
	function _checkIfWinner(playerSign) {
		// Sign on the board has to match every winning combination of the same array
		return winningMoves.find((winningCombinaton) => {
			return winningCombinaton.every((position) => {
				return gameBoard.getPosition(position) == playerSign;
			});
		});
	}

	//Complete game logic
	function gameLogic(position) {
		if (gameOngoing) {
			// Check if play is possible
			if (_makePlay(position, currentPlayer)) {
				// Check if the play made resulted in win, if so, increase score and return winning array
				winningArray = _checkIfWinner(currentPlayer.sign);
				if (Array.isArray(winningArray)) {
					gameOngoing = false; // disable game
					currentPlayer.increaseScore();
					return winningArray;
				}
				// If no winner, check for TIE (in case board is full)
				else if (gameBoard.checkIfBoardFull()) {
					gameOngoing = false;
					return "TIE";
				}
				_toggleCurrentPlayer(); // Toggles Current Player if Play is Sucessfull
			} else {
				// Play not sucessfull
				return false;
			}
		}
		return false; // game not ongoing/active
	}

	return {
		getCurrentPlayer,
		gameLogic,
		resetGameState,
		disableGame,
		getGameState,
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
			oSignImage.src = "./images/osign.png";
			xSignImage.src = "./images/xsign.png";
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
						c;
					default:
						break;
				}
			}
		}
	}

	// Resets the rendered Board (for a new game)
	function resetRenderBoard() {
		let boardPositions = document.getElementsByClassName("positions");
		for (let position of boardPositions) {
			position.innerHTML = "";
			position.classList.remove("played");
			position.classList.remove("winner-position");
		}
		updatePlayerInfo(); // updates the player info box
	}

	//update player info box at the top (names, score, currentPlayer)
	function updatePlayerInfo() {
		document.getElementById("player1name").innerText = `Name: ${player1.name}`;
		document.getElementById("player2name").innerText = `Name: ${player2.name}`;
		document.getElementById(
			"player1score"
		).innerText = `Score: ${player1.getScore()}`;
		document.getElementById(
			"player2score"
		).innerText = `Score: ${player2.getScore()}`;
		document.getElementById("current-player").innerText = `Current Player: ${
			gameFlow.getCurrentPlayer().name
		} (${gameFlow.getCurrentPlayer().sign})`;
	}

	//Trigger End of Game message (win or tie)
	const triggerEndMsg = (result) => {
		document.getElementById("player-info").style.display = "none";
		document.getElementById("game-ending").style.display = "flex";
		if (result == "tie") {
			document.getElementById("end-game-text").innerText =
				"The game ended in a TIE!";
		} else {
			document.getElementById("end-game-text").innerText = `${
				gameFlow.getCurrentPlayer().name
			} won this round!`;
		}
	};

	// Restart game, resets game state and board
	let restartButtons = document.getElementsByClassName("restart-game");
	for (var i = 0; i < restartButtons.length; i++) {
		restartButtons[i].addEventListener("click", function (event) {
			resetRenderBoard(); //resets displayed board
			gameBoard.resetBoard(); //reset stored array board
			gameFlow.resetGameState(); //reset game state to active
			updatePlayerInfo(); //updates player info box
			document.getElementById("game-ending").style.display = "none";
			document.getElementById("player-info").style.display = "flex";
		});
	}

	// Changes player Names, resets player data and scores.
	document
		.getElementById("change-players")
		.addEventListener("click", function (event) {
			gameFlow.disableGame(); // disables game functionality while on other menus
			document.getElementById("game-board").style.opacity = 0.3;
			document.getElementById("player-names").style.display = "grid";
			document.getElementById("player-info").style.display = "none";
		});

	// Submit button for changing player names
	document
		.getElementById("submit-btn")
		.addEventListener("click", function (event) {
			let p1name = document.getElementById("player1").value;
			let p2name = document.getElementById("player2").value;
			player1 = playerFactory(p1name, "X"); //create players
			player2 = playerFactory(p2name, "O");
			gameBoard.resetBoard();
			gameFlow.resetGameState();
			// changes view to board and player info again
			document.getElementById("game-board").style.opacity = 1;
			document.getElementById("player-names").style.display = "none";
			document.getElementById("player-info").style.display = "flex";
			resetRenderBoard();
		});

	//Player board displayed on screen
	document
		.getElementById("game-board")
		.addEventListener("click", function (event) {
			//Game Board Event Listeners
			if (event.target.classList.contains("positions")) {
				let position = event.target.id.slice(-1); // get position clicked
				if (gameFlow.getGameState()){ // check if game is active 
					resultOfPlay = gameFlow.gameLogic(position); // check if position is a valid play
					updatePlayerInfo(); // updates player info (in this case the currentPlayer only since it's in between plays)
					if (Array.isArray(resultOfPlay)) {
						// In case of WIN
						render();
						triggerEndMsg(gameFlow.getCurrentPlayer()); //Trigger End Msg with winning player
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
						triggerEndMsg("tie"); //Trigger End Msg with tie
					} else {
						render();
					}
				}
			}
		});
})();
