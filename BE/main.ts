let express = require('express');
const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const cors = require('cors');
const LoggerSingleton = require('./logger');
const db = require('./config/database.ts')


app.use(cors());
app.use(express.json());



// //test
// db.authenticate().then(()=>{ 
//   console.log('db connected')
// }).catch((e:any)=>{
//   console.log(e);
// })

const rooms:any = {
  owners:{
  }
}//objekat gde se pamte sobe i useri

io.on('connection', (socket:any) => { //event sta se desava kada se konektuje na socket
  console.log(socket.id);
  socket.on('join_room',(room_name:string)=>{ //event poziva se ovo kada se desi join_room
    roomHandlerFacade(socket,room_name);
    socket.join(room_name);//funkcija za ulazenje u sobu
    rooms[socket.id] = room_name;//ubaci se u objekat za sobu gde je key id soketa a ime sobe value
  })
  socket.on('draw',(e:any)=>{//soket koji prosledjuje koordinate crteza svima u sobi
    LoggerSingleton.logs.colors.push(e.color)
    io.to(rooms[socket.id]).emit('draw',e)//event ime je draw
  })
  socket.on('chat-message',(msg:any)=>{//prosledjuju se poruke
    LoggerSingleton.logs.chats.push(msg);
    io.to(rooms[socket.id]).emit('chat-message',msg);
  })
})
io.on('disconnect',(socket:any)=>{
  console.log(`${socket.id} is dead`);
  delete rooms[socket.id]
  // rooms.owners[]
  delete rooms.owners[socket.id]
})

const roomHandlerFacade = (socket:any,room_name:string)=>{
  if(!rooms.hasOwnProperty(room_name)){
    rooms[room_name] = socket.id
    socket.emit('isOwner',200)
  }else{
    if(rooms.hasOwnProperty(`${room_name}_list`)){
      rooms[`${room_name}_list`] = [...rooms[`${room_name}_list`],socket.id]
    }else{
      rooms[`${room_name}_list`] = [socket.id]
      
    }
  }
}

http.listen("4002",()=>{
  console.log('connected to 4001');
});
