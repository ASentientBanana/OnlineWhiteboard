let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const cors = require('cors');
const Logger = require('./logger');


app.use(cors());
io.on('connection', (socket) => {
  console.log(`CONNECTED ${socket.id}`);
  socket.on("m",e=>{
    socket.broadcast.emit("m",e)
  });
  socket.on("mb",e=>{
    socket.broadcast.emit("mb","")
  });

  socket.on("chat-msg",msg=>{
    Logger.addLog(msg)
    socket.broadcast.emit("chat-msg",msg)
  })
  // end of connect
});

http.listen("4001",()=>{
  console.log('connected to 4001');
})