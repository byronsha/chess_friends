const express = require('express')
const app = express()

app.use(express.static(__dirname))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

const server = require('http').Server(app)
const port = 3000

server.listen(port, () => {
  console.log('Listening on port ' + port)
})
