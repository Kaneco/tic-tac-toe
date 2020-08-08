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
        var board = new Array(9); //Creates board to store player positions

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
                if (element != null) {
                    return true;
                }
                else {
                    return false;
                }
        }

        function getPosition(position){
            return board[position];
        }


    return {
    }
})();
