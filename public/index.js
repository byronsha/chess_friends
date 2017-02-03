function initGame() {
  const config = {
    draggable:  true,
    position: 'start',
    onDrop,
    onSnapEnd,
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
}

// update board position after piece snap
// for castling, en passant, and pawn promotion
function onSnapEnd() {
  board.position(game.fen())
  console.log(game.fen())
}
