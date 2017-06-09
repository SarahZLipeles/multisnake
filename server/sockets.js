const socketFunction = io => {
  io.on('connection', socket => {
    console.log('got a connection', socket.id)

    socket.on('disconnect', () => {
      console.log(socket.id, 'disconnected')
    })
  })
}

module.exports = socketFunction
