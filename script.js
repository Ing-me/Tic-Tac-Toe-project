const openMenu = document.querySelector('.open-menu');


openMenu.addEventListener('click', () => {
    const navItem = document.querySelector('.nav-item');
    navItem.classList.toggle('activated')
})
let createPlayer = () => {
    document.querySelector('.board').style.pointerEvents = "auto";

    for (let i = 0; i <= 2; i++){
        if(gameBoardModule.playerArray.length >= 2){
            gameBoardModule.makeMove();
            break;
        }
        if(gameBoardModule.playerArray.length == 0){
            let playerOne = "X"
            gameBoardModule.playerArray.push(playerOne)
        } else if(gameBoardModule.playerArray.length != 0){
            let playerTwo = "O";
            gameBoardModule.playerArray.push(playerTwo)
        }
    }
    document.querySelector('.input-text').innerText = `You are the ${gameBoardModule.playerArray[0]} and the computer is ${gameBoardModule.playerArray[1]}`
}

let gameBoardModule = (function(){
    let gameBoard = [];
    let playerArray = [];
    

    let makeMove = () => {
        if(playerArray.length == 2 && gameBoard.length < 9){
            if(gameBoard.length == 0){
                gameBoard.push(playerArray[0])
            } else if(gameBoard[gameBoard.length - 1] == "X"){
                gameBoard.push(playerArray[1])
            }
        }
    }
   

    return { gameBoard, playerArray, makeMove }
})();

let DisplayController = (function (){
   let boxes = Array.from(document.querySelectorAll('.item'))
//    let cells = Array(9).fill(null)
    let cells = Array.from(Array(9).keys());
   const winArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
   
   boxes.forEach(box => box.addEventListener('click', turnClick))
   

   function turnClick(e){
        const id = e.target.id 
        if(typeof cells[id] === 'number'){
            turn(id, gameBoardModule.playerArray[0])    
            if(!checkTie())  turn(bestSpot(), gameBoardModule.playerArray[1])   
                         
        }
   }
   function turn(id, player){
        cells[id] = player
        document.getElementById(id).innerText = player
        if(checkWin(cells, player)){
            const winnerMessage = document.querySelector('#winnerMessage');
            winnerMessage.classList.add("show");
            const winner = document.querySelector('#winner');
            winner.textContent = `${player} is win`
        }
        if(isDraw()){
            const winnerMessage = document.querySelector('#winnerMessage');
            winnerMessage.classList.add("show");
            const winner = document.querySelector('#winner');
            winner.textContent = `Draw the game`
        }
      }

   function emptySquare(){
        
        return cells.filter(cell =>  typeof cell == 'number');
   }
//    function checkWin(player){
//         return winArray.some(condition => {
//             return condition.every(index => {
//                 return boxes[index].classList.contains(player)
//             })
//         })
//    }
   function checkWin(board, player){
    let plays = board.reduce((a,e,i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null
    for(let [index, win] of winArray.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = { index:index, player:player };
            break;
        }
    }
    return gameWon;
   }
   function isDraw(){
        let playerX = 0;
        let playerO = 0;
        for(let i = 0; i < cells.length; i++){
            if(cells[i] == "X"){
                playerX++;
            } else{
                playerO++;
            }
        }
        console.log(playerX)
       if(playerX == 5 && playerO == 4){
         return true;
       }
       return false
   }

   function bestSpot(){
    console.log(cells)
        return miniMax(cells, gameBoardModule.playerArray[1]).index
   }

   function checkTie(){
       console.log(emptySquare())
    if(emptySquare().length == 0){
        for (let i = 0; i < boxes.length; i++) {
           boxes[i].removeEventListener('click', turnClick, false)                
        }
        // declareWinner("Tie");
        return true;
    }
    return false;
}

   function miniMax(newBoard, player){
        let availableSpot = emptySquare(newBoard);
        if(checkWin(newBoard, player)){
            return { score: -10}
        } else if(checkWin(newBoard, gameBoardModule.playerArray[1])){
            return { score: 20 }
        } else if(availableSpot.length === 0){
            return { score: 0 }
        }
        let moves = [];
        for(let i = 0; i < availableSpot.length; i++){
            let move = {}
            move.index = newBoard[availableSpot[i]]
            newBoard[availableSpot[i]] = player

            if(player == gameBoardModule.playerArray[1]){
                let result = miniMax(newBoard, gameBoardModule.playerArray[0])
                move.score = result.score
            } else{
                let result = miniMax(newBoard, gameBoardModule.playerArray[1])
                move.score = result.score
            }
            newBoard[availableSpot[i]] = move.index
            moves.push(move)
        }

        let bestMove = 0;

        if(player === gameBoardModule.playerArray[1]){
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score
                    bestMove = i
                }
            }
        } else{
            let bestScore = 10000
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i
                }
            }
        }
        return moves[bestMove]
   }


    const start = document.querySelector('#start');
    start.addEventListener('click', createPlayer);

    const restard = document.querySelector('#restart').addEventListener('click', restartGame)
})();

function restartGame(){
    location.reload()
}