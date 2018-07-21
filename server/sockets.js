
module.exports = app => {
  const http = require('http').Server(app);
  var io = require('socket.io')(http);
  //io is like the socket controller
  io.on('connection', (socket) => {
      console.log(`A user connected at ${new Date()}`)
      // io.emit('connectedUsers', socket.Server.parser.CONNECT)
      socket.on('disconnect', function () {
        console.log(`A user disconnected at ${new Date()}`);
      });

      socket.on('createRoom', room => {
        socket.join(room.id) //join a room
        io.emit('addRoom', room) //add created room to all connected users
        io.to(room.id).emit('joinRoom', room) //new user will join created room on client side
      })

      socket.on('joinRoom', room => {
        socket.join(room.id) //socket joins existing room
        io.to(room.id).emit('joinRoom', room) //tell client about the joined room
      })

      socket.on('changeRoomName', (room, newName) => {
        io.emit('roomNameChanged', room, newName)
      })

      socket.on('vote', function (room, isYes) {
        io.to(room.id).emit('vote', isYes)
        //emit a vote to all sockets within the room
      });

      socket.on('reset', function(room) {
        io.to(room.id).emit('reset') //reset vote settings for a room
      })

      socket.on('chat-down', (roomID, msg) => {
        console.log(msg)
        io.to(roomID).emit('chat-up', msg)
    })

  });

  return io
}
