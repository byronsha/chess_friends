const socket = io()

function initGame() {
  const config = {
    draggable:  true,
    position: 'start',
    onDrop
  }

  board = new ChessBoard('gameboard', config)
  game = new Chess()
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target
  })

  if (move === null) {
    return 'snapback'
  }

  updateMovesList(move)
  socket.emit('move', move)
}

socket.on('move', function(move) {
  game.move(move)
  updateMovesList(move)

  setTimeout(function() {
    board.position(game.fen())
  }, 1000)
})

function updateMovesList(move) {
  let color = move.color === 'w' ? 'white' : 'black'
  const listItem = `<li>${move.piece} from ${move.from} to ${move.to}</li>`

  $(`#${color}-moves ul`).append(listItem)
}

// update board position after piece snap
// for castling, en passant, and pawn promotion
function onSnapEnd() {
  board.position(game.fen())
  console.log(game.fen())
}