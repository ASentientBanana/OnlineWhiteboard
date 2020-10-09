let express = require('express');
const app = express();
let http = require('http').createServer(app);
const socketIO = require('socket.io')(http);
const cors = require('cors');
const LoggerSingleton = require('./logger');
const db = require('./config/database.ts');
const MessageModel = require('./models/Message');
const DBUtility = require('./util/DBUtility')

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


http.listen("4000", () => {
  console.log('connected to 4000');
});
app.listen('4001',()=>{
  console.log('connected to express 4001');
})

const rooms: any = {
  owners: {
  }
}//objekat gde se pamte sobe i useri
const users: any = {}

db.authenticate()// povezuje sa bazom i radi autentikaciju
  .then(() => console.log('connected to DB'))//u slucaju uspeha 
  .catch((e: any) => { console.log(`ERR :: ${e}`) })//u slucaju error-a


socketIO.on('connection', (socket: any) => { //event sta se desava kada se konektuje na socket

  socket.on('set_name', (user_name: string) => {
    // DBUtility.createUser(user_name)
  })

  socket.on('join_room', (room_name: string) => { //event poziva se ovo kada se desi join_room
    roomJoinHandlerFacade(socket, room_name);
    socket.join(room_name);//funkcija za ulazenje u sobu
    rooms[socket.id] = room_name;//ubaci se u objekat za sobu gde je key id soketa a ime sobe value
  })

  socket.on('draw', (e: any) => {//soket koji prosledjuje koordinate crteza svima u sobi
    // LoggerSingleton.logs.colors.push(e.color)
    socket.to(rooms[socket.id]).emit('draw', e)//event ime je draw
  });

  socket.on('update-word', (word: string) => {
    if (rooms[rooms[socket.id]].owner.socket.id === socket.id) {
      rooms[rooms[socket.id]]["word"] = word;
    }
  });

  socket.on('chat-message', (msg: any) => {//prosledjuju se poruke
    console.log(DBUtility.getUserIdByName("testUser1"));


    // LoggerSingleton.logs.chats.push(msg.body);
    // socketIO.to(rooms[socket.id]).emit('chat-message', msg);
    // DBUtility.createMesssageEntry(msg.body,msg.name);
    // DBUtility.createTest(msg.body);
    // if (findWord(rooms[rooms[socket.id]].word, msg.body.toLowerCase())) {
    //     io.to(rooms[socket.id]).emit('WINNER', msg.name)
    //   }
  });
  //socket disconnect


  socket.on('save-image-to-database', async (imageData: any) => {
    DBUtility.getUserIdByName(imageData.userName)
      .then((user: any) => {
        DBUtility.createImageEntry(imageData.image, user.dataValues.id)
      })
      .catch((e: string) => {
        console.log(e);
      })
  })
  // getImagesForUser


  socket.on('disconnect', () => {
    try {
      if (rooms[rooms[socket.id]] && rooms[rooms[socket.id]].users.length > 0) rooms[rooms[socket.id]].users.shift()
      delete rooms[rooms[socket.id]].owner
      if (rooms[rooms[socket.id]].users[0]) {
        rooms[rooms[socket.id]].owner = rooms[rooms[socket.id]].users[0];
      }
    } catch (error) {
      // console.log(error);
    }
  })


});

const findWord = (word: string, str: string) => {
  console.log(str);
  return str.split(' ').some((w) => { return w === word })
}
const roomJoinHandlerFacade = (socket: any, room_name: string) => {
  if (!rooms.hasOwnProperty(room_name)) {
    rooms[room_name] = {
      owner: {
        socket
      },
      users: [socket]
    }
  } else {
    const id = socket.id
    rooms[room_name].users.push({ socket });
  }
}

app.get('/getme/:name',(req:any,res:any)=>{
  console.log(req.params.name);
  DBUtility.getUserIdByName(req.params.name)
      .then((user: any) => {
        if(user){
          DBUtility.getImagesForUser(user.dataValues.id)
          .then((data: any) => {
            res.send({ data })
          })
          .catch((e: string) => {
            console.log(e);
          })
        }
      })
      .catch((e: string) => {
        console.log(e);
      })
})