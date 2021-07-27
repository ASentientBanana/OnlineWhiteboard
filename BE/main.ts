import express from 'express';
import db from './tmp.db.json'
const app = express();
import  http from 'http';
const server = http.createServer(app);
import socketIO from 'socket.io';
const io = socketIO(server);
import cors from 'cors'
import {urlencoded,json} from 'body-parser'
import logger from './logger';  

// TODO:sla

//  add a builder
//  add a factory || facade 

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{ 
  res.send(JSON.stringify(db))
});

server.listen("4002", () => { 
  // sluzi za soket konekcije
  console.log('socket port: 4002');
});
app.listen('4003', () => {
  // express server za post i get requestove
  console.log('express port 4003'); 
})
io.on('connection', (socket: any) => {
  socket.on('joinRoom',(socketEvent:any)=>{
      socket.join(socketEvent.roomName); //dodaje korisnika u sobu
    logger.addTextLog(`user ${socketEvent.userName} joined ${socketEvent.roomName}`)
})
  // drawData: { userName, roomName, drawData:{ x, y, color, type } }
  socket.on('drawing',(drawData:any)=>{
    socket.to(drawData.userInfo.roomName).emit('drawing', drawData.drawingData); // draw event
  })
  socket?.on("drawRectangle",(data:any)=>{
    socket.to(data.userInfo.roomName).emit('drawRectangle', data); // draw event

  });
  socket?.on("moveBrush", (data:any)=>{
    socket.to(data.userInfo.roomName).emit('moveBrush', data.brushPos); // draw event
  });
  socket?.on("paintCanvas",(data:any)=>{
    console.log(data.userInfo.roomName);
    
    socket.to(data.userInfo.roomName).emit('paintCanvas', data.color); // draw event
  });
  socket?.on("sendChatMessage",(data:any)=>{
    io.to(data.roomName).emit('sendChatMessage', data); 
    logger.addTextLog(`chat message > ${data.body} by user ${data.userName} in room: ${data.roomName}`)
  })
})
