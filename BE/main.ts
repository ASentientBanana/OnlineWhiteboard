let express = require('express');
const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const cors = require('cors');
const LoggerSingleton = require('./logger');
const Sequalize = require('sequelize')

const db = new Sequalize('whiteboardDB','postgres','lazy',{
  host:'192.168.0.201',
  // port:9465,
  dialect:'postgres',
  operatorsAliases:'false',
  pool:{
    max:5,
    min:4,
    acure:30000,
    idle:10000
  }
});
app.use(cors());
app.use(express.json());



//test
// db.authenticate().then(()=>{
//   console.log('db connected')
// }).catch((e:any)=>{
//   console.log(e);
// })

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
