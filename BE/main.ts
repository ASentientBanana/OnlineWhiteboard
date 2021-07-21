import express from 'express';
import db from './tmp.db.json'
const app = express();
import  http from 'http';
const server = http.createServer(app);
import socketIO from 'socket.io';
const io = socketIO(server);
import cors from 'cors'
import fs from 'fs';
import {urlencoded,json} from 'body-parser'

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use(express.json());

const roomCollection = { rooms:{} }


app.get('/',(req,res)=>{
  res.send(JSON.stringify(db))
});


server.listen("4002", () => { // sluzi za soket konekcije
  console.log('socket port: 4002');
});
app.listen('4003', () => {
  console.log('express port 4003'); // express server za post i get requestove
})

io.on('connection', (socket: any) => {
  socket.on('joinRoom',(socketEvent:any)=>{
      console.log(socketEvent)
      socket.join(socketEvent.roomName); //dodaje korisnika u sobu
  })
  socket.on('drawing',(drawData:any)=>{
    console.log(drawData)
  })
})
