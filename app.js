const express = require('express')
const app = express()

const server = require('http').createServer(app)
const port = 3000

const io = require('socket.io')(server)

io.on('connection', function(socket) {
  console.log('New connection')

  socket.on('move', function(move) {
    socket.broadcast.emit('move', move)
  })
})

app.use(express.static(__dirname))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

server.listen(port, () => {
  console.log('Listening on port ' + port)
})
