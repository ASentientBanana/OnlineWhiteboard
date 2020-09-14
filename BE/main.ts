let express = require('express');
const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const cors = require('cors');
const LoggerSingleton = require('./logger');
const db = require('./config/database.ts');
const MessageModel = require('./models/Message');

app.use(cors());
app.use(express.json());

// rooms: {
//     room_name: {
//           Owner:{}
//             users:[      

//      ]
//     }
// }
//ovo je struktura za sobe


const rooms:any = {
  owners:{
  }
}//objekat gde se pamte sobe i useri

io.on('connection', (socket:any) => { //event sta se desava kada se konektuje na socket
  console.log(socket.id);
  socket.on('join_room',(room_name:string)=>{ //event poziva se ovo kada se desi join_room
    roomJoinHandlerFacade(socket,room_name);
    socket.join(room_name);//funkcija za ulazenje u sobu
    rooms[socket.id] = room_name;//ubaci se u objekat za sobu gde je key id soketa a ime sobe value
  })
  socket.on('draw',(e:any)=>{//soket koji prosledjuje koordinate crteza svima u sobi
    // LoggerSingleton.logs.colors.push(e.color)
    console.log(e);
    // io.to(rooms[socket.id]).emit('draw',e)//event ime je draw
  })
  socket.on('update-word',(word:string)=>{
    if(rooms[rooms[socket.id]].owner.socket.id === socket.id){
      rooms[rooms[socket.id]]["word"] = word;
    }
  })
  socket.on('chat-message',(msg:any)=>{//prosledjuju se poruke
    LoggerSingleton.logs.chats.push(msg.body);
    io.to(rooms[socket.id]).emit('chat-message',msg);
    if(findWord(rooms[rooms[socket.id]].word,msg.body.toLowerCase())){
      io.to(rooms[socket.id]).emit('WINNER',msg.name)
    } 
  })
})
io.on('disconnect',(socket:any)=>{
  console.log(`${socket.id} is dead`);
  delete rooms[socket.id]
  delete rooms.owners[socket.id]
})
const findWord = (word:string, str:string) => {
  console.log(str);
  return str.split(' ').some((w) => {return w === word})
}
const roomJoinHandlerFacade = (socket:any,room_name:string)=>{
  if(!rooms.hasOwnProperty(room_name)){
    const id = socket.id; 
  rooms[room_name] = {
    owner:{
      socket
    },
    users:[{socket}]
  }
  }else{
    const id = socket.id
    rooms[room_name].users.push({id:socket});
  }
}

http.listen("4009",()=>{
  console.log('connected to 4001');
});

