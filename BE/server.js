let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (socket) => {

  // console.log('a user connected');
  
  socket.on("m",e=>{
    socket.broadcast.emit("m",e)
  });
  socket.on("mb",e=>{
    socket.broadcast.emit("mb","")
  });


  socket.on("chat-msg",msg=>{
    socket.broadcast.emit("chat-msg",msg)
  })

  // end of connect
});




http.listen(3000, () => {
  console.log('listening on *:3000');
})