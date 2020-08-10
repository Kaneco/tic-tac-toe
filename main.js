let winningMoves = [ //Possible Winning Moves Array
	[0, 1, 2], // Line Wins ->
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6], // Column Wins 
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8], // Diagonal Wins
	[2, 4, 6],
];

// Creates Players
const playerFactory = (name, sign, score) => {
    const increaseScore = () => { // increases score on Win
        score += 1;
    };
    return {name,sign,score,increaseScore};
};

// Board Operations and Methods
const gameBoard = (() => { 
        // var board = new Array(9); //Creates board to store player positions
        let board = ["X", "X", "X","O", "O", "O","","",""];

        function changeBoard(position, sign){ //Update play made to the board, checking first if position is empty
            if (checkIfEmpty(position)) {
                board[position]= sign;
                return true; // Sucess Changing position
            }
            else {
                return false; 
            }
        }

        function checkIfEmpty(position){ //Check if given position is Empty
                const element = board[position];
                if (element != null || element != undefined) {
                    return false;
                }
                else {
                    return true;
                }
        }

        function getPosition(position){
            return board[position];
        }


    return {changeBoard, checkIfEmpty, getPosition, board}
})();

// Board Operations and Methods
const gameFlow = (() => { 
    return {}
})();


function render(){ // renders positions played from the Array to the HTML page, only renders new positions played.
    boardPositions = document.getElementsByClassName("positions");
    for (let position of boardPositions ) {
        let oSignImage = document.createElement("img");
        let xSignImage = document.createElement("img");
        oSignImage.src = "/images/osign.png";
        xSignImage.src = "/images/xsign.png";
        oSignImage.className = "bounce-in-fwd";
        xSignImage.className = "bounce-in-fwd";
        if (!position.classList.contains("played")){ // only adds new plays, not already stored plays
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
function resetRenderBoard(){ // Resets the rendered Board (for a new game)
    boardPositions = document.getElementsByClassName("positions");
    for (let position of boardPositions ) {
        position.innerHTML = "";
        position.classList.remove("played");
    }
}
