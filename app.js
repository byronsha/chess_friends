const express = require('express')
const app = express()

const server = require('http').createServer(app)
const port = 3000

const io = require('socket.io')(server)

let games = []

io.on('connection', function(socket) {
  console.log('Player joined the lobby')
  
  function findGameByPlayer(socketid) {
    return games.find((game) => {
      return game.white === socket.id || game.black === socket.id
    })
  }

  function refreshGames() {
    socket.emit('games', games)
    socket.broadcast.emit('games', games)
  }

  function clearGame(socketid) {
    const foundGame = findGameByPlayer(socket.id)
    
    if (foundGame) {
      io.to(foundGame.white).emit('clear_game')
      io.to(foundGame.black).emit('clear_game')
    }

    games = games.filter((game) => {
      return game.white !== socket.id && game.black !== socket.id
    })
  }

  socket.on('new_game', function(params) {
    const newGame = {
      white: socket.id,
      black: null
    }

    games.push(newGame)
    refreshGames()
  })

  socket.on('join_game', function(whiteId) {
    const foundGame = games.find((game) => {
      return game.white === whiteId
    })
    foundGame.black = socket.id
    refreshGames()
  })

  socket.on('move', function(move) {
    const foundGame = findGameByPlayer(socket.id)
    const opponentId = move.color === 'w' ? foundGame.black : foundGame.white
    io.to(opponentId).emit('move', move)
  })

  socket.on('leave_game', function() {
    clearGame(socket.id)
    refreshGames()
  })

  socket.on('disconnect', function() {
    clearGame(socket.id)
    refreshGames()
  });

  socket.emit('games', games)
})

app.use(express.static(__dirname))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

server.listen(port, () => {
  console.log('Listening on port ' + port)
})
