function initGame() {
  const config = {
    draggable:  true,
    position: 'start',
    onDrop: handleMove,
  }

  board = new ChessBoard('gameboard', config)
  game = new Chess()
}

function handleMove(source, target) {
  const move = game.move({
    from: source,
    to: target
  })

  if (move === null) {
    return 'snapback'
  }
}
