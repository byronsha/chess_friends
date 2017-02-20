const express = require('express')
const app = express()

const server = require('http').createServer(app)
const port = 3000

const io = require('socket.io')(server)

let games = []

io.on('connection', function(socket) {
  console.log('Player joined the lobby')

  socket.on('new_game', function(params) {
    const newGame = {
      white: socket.id,
      black: null
    }

    games.push(newGame)
    socket.emit('games', games)
    socket.broadcast.emit('games', games)
  })

  socket.on('join_game', function(whiteId) {
    const foundGame = games.find((game) => {
      return game.white === whiteId
    })
    foundGame.black = socket.id

    socket.emit('games', games)
    socket.broadcast.emit('games', games)
  })

  socket.on('move', function(move) {
    const foundGame = games.find((game) => {
      return game.white === socket.id || game.black === socket.id
    })
    
    const opponentId = move.color === 'w' ? foundGame.black : foundGame.white
    io.to(opponentId).emit('move', move)
  })

  socket.on('leave_game', function() {
    games = games.filter((game) => {
      return game.white === socket.id || game.black === socket.id
    })

    socket.emit('games', games)
    socket.broadcast.emit('games', games)
  })

  socket.emit('games', games)
})

app.use(express.static(__dirname))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

server.listen(port, () => {
  console.log('Listening on port ' + port)
})
