let express = require('express');
const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const cors = require('cors');
const LoggerSingleton = require('./logger');

app.use(cors());
app.use(express.json());

const rooms:any = {}
io.on('connection', (socket:any) => {
  console.log(socket.id);
  socket.on('join_room',(room_name:string)=>{
    console.log(`joining room ${room_name}` );
    socket.join(room_name);
    rooms[socket.id] = room_name;
  })
  socket.on('draw',(e:any)=>{
    LoggerSingleton.logs.colors.push(e.color)
    io.to(rooms[socket.id]).emit('draw',e)
  })
  
})




http.listen("4002",()=>{
  console.log('connected to 4001');
  // console.log(LoggerSingleton.logs);
  
})