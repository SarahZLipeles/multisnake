const socketFunction = function (io) {
  io.on('connection', function (socket) {
    console.log('got a connection', socket.id)

    socket.on('disconnect', function () {
      console.log(socket.id, 'disconnected')
    })
  })
}

module.exports = socketFunction
