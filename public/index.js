const socket = io()
let color = null

function initGame() {
  const config = {
    draggable:  true,
    position: 'start',
    onDrop,
    onSnapEnd
  }

  board = new ChessBoard('gameboard', config)
  game = new Chess()
  color = 'w'

  socket.emit('new_game')
}

function joinGame(whiteId) {
  const config = {
    draggable:  true,
    position: 'start',
    orientation: 'black',
    onDrop,
    onSnapEnd
  }

  board = new ChessBoard('gameboard', config)
  game = new Chess()
  color = 'b'

  socket.emit('join_game', whiteId)
}

function leaveGame() {
  socket.emit('leave_game')
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target
  })

  if (move === null || !color || color !== move.color) {
    return 'snapback'
  }

  updateMovesList(move)
  socket.emit('move', move)
}

// update board position after piece snap
// for castling, en passant, and pawn promotion
function onSnapEnd() {
  board.position(game.fen())
}

function updateMovesList(move) {
  let color = move.color === 'w' ? 'white' : 'black'
  const listItem = `<li>${move.piece} from ${move.from} to ${move.to}</li>`

  $(`#${color}-moves ul`).append(listItem)
}

function clearGame() {
  $('#gameboard').html('')

  board = null
  game = null
  color = null
}

function clearMovesList() {
  $('#white-moves ul').html('')
  $('#black-moves ul').html('')
}

socket.on('move', function(move) {
  game.move(move)
  updateMovesList(move)

  setTimeout(function() {
    board.position(game.fen())
  }, 1000)
})

socket.on('games', function(games) {
  $('#games').html('')
  for (let i = 0; i < games.length; i++) {
    const game = $(`<div>${games[i].white}, ${games[i].black}</div>`)
    game.click(() => {
      joinGame(games[i].white)
    })
    $('#games').append(game)
  }
})

socket.on('clear_game', function() {
  clearGame()
  clearMovesList()
})

$(document).ready(() => {
  $('#start-game-btn').click(() => {
    let playerName = $('#player-name').val()
    if (!playerName) { return }
    initGame(playerName)
  })

  $('#leave-game-btn').click(() => {
    leaveGame()
  })
})