const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const playerMoveElement = document.querySelector('[data-move-el]');
const modal = document.querySelector('#my-dialog');
const winnerImg = document.querySelector('[data-winner-el]');
const modalTitle = document.querySelector('[data-result-title]');
const modalP = document.querySelector('[data-result-text]');
const restartBtn = document.querySelector('[data-restart]');
const cross = new Image();
const circle = new Image();

cross.src = './assets/cross.svg';
circle.src = './assets/circle.svg';

const crossSize = {
  width: 120,
  height: 120,
}

const circleSize = {
  width: 120,
  height: 120,
}

const gameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

let player = 'X';
let gameOver = false;
let move = 0;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const widthCanvas = canvas.width;
const heightCanvas = canvas.height;

const gameFieldWidth = 450;
const gameFieldHeight = 450;

const gameCoordinatesY = (heightCanvas - gameFieldHeight) / 2;
const gameCoordinatesX = (widthCanvas - gameFieldWidth) / 2;

const cellWidth = gameFieldWidth / 3;
const cellHeight = gameFieldHeight / 3;
const lineX = gameCoordinatesX + cellWidth;
const lineY = gameCoordinatesY + cellHeight;

function createGameBoard(ctx) {
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.moveTo(lineX, gameCoordinatesY);
  ctx.lineTo(lineX, gameCoordinatesY + gameFieldHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.moveTo(gameCoordinatesX + cellWidth * 2, gameCoordinatesY);
  ctx.lineTo(gameCoordinatesX + cellWidth * 2, gameCoordinatesY + gameFieldHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.moveTo(gameCoordinatesX, lineY);
  ctx.lineTo(gameCoordinatesX + gameFieldWidth, lineY);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.moveTo(gameCoordinatesX, gameCoordinatesY + cellHeight * 2);
  ctx.lineTo(gameCoordinatesX + gameFieldWidth, gameCoordinatesY + cellHeight * 2);
  ctx.stroke();
}

createGameBoard(ctx);

function checkWinner(player, board) {

  for (let row = 0; row < board.length; row++) {
    let matches = 0;
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === player) {
        matches++;
      }
    }
    if (matches === 3) {
      return true;
    }
  }

  for  (let col = 0; col < board[0].length; col++) {
    let matches = 0;
    for (let row = 0; row < board.length; row++) {
      if (board[row][col] === player) {
        matches++;
      }
    }
    if (matches === 3) {
      return true;
    }
  }

  if (
    board[0][0] === player
    && board[1][1] === player
    && board[2][2] === player) {
    return true;
  } else if (
    board[0][2] === player
    && board[1][1] === player
    && board[2][0] === player) {
    return true;
  }

  return false;
}

function resetGame(board, ctx, modal) {
  board.forEach((row,) => {
    row.fill(null);
  })
  player = 'X';
  gameOver = false;
  move = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  playerMoveElement.src = './assets/cross.svg';

  createGameBoard(ctx);
  modal.close()
}

canvas.addEventListener('click', (e) => {
  if (gameOver) {
    return;
  }

  const canvasLocation = canvas.getBoundingClientRect();
  const clickX = e.clientX - canvasLocation.left;
  const clickY = e.clientY - canvasLocation.top;

  if (clickX >= gameCoordinatesX
    &&
    clickX < gameCoordinatesX + gameFieldWidth
    &&
    clickY >= gameCoordinatesY
    &&
    clickY < gameCoordinatesY + gameFieldHeight)  {

    const x = clickX - gameCoordinatesX;
    const y = clickY - gameCoordinatesY;

    const col = Math.floor(x / cellWidth)
    const row = Math.floor(y / cellHeight);

    if (gameBoard[row][col] === null) {
      gameBoard[row][col] = player;

      const cellX = gameCoordinatesX + col * cellWidth;
      const cellY = gameCoordinatesY + row * cellHeight;

      const imageX = cellX + (cellWidth - crossSize.width) / 2;
      const imageY = cellY + (cellHeight - crossSize.height) / 2;

      const figure = player === 'X' ? cross : circle;

      ctx.save();

      ctx.shadowColor = player === 'X'
        ? '#20e7ff'
        : '#f029ff';

      ctx.shadowBlur = 25;

      ctx.drawImage(
        figure,
        imageX,
        imageY,
        crossSize.width,
        crossSize.height
      );

      ctx.restore();

      move++;

      if (checkWinner(player, gameBoard)) {
        gameOver = true;
        console.log('Winner', player);
        modal.showModal();
        player === 'X' ? winnerImg.src = './assets/cross.svg' : winnerImg.src = './assets/circle.svg';
        return;
      };

      if (move === 9) {
        gameOver = true;
        console.log('Not Winner');
        modalTitle.textContent = 'DRAW!';
        modalP.textContent = 'Nobody wins. Try again!';
        modal.showModal();
        return;
      }

      player = player === 'X' ? 'O' : 'X';
      player === 'X' ? playerMoveElement.src = './assets/cross.svg' : playerMoveElement.src = './assets/circle.svg';
    }

  }
})

restartBtn.addEventListener('click', () => {
  resetGame(gameBoard, ctx, modal);
})