import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import socketIO from 'socket.io';
const io = socketIO(server);
import cors from 'cors';
import { urlencoded, json } from 'body-parser';
import logger from './logger';
import sequelize from './config/database';
import ImageModel from './models/Image';
import fs from 'fs';

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use(express.json());
app.use(express.static('public'))
const roomCollection: any = {}

const authenticateDB = async () => {
	sequelize.authenticate().then(() => console.log('connected to DB')).catch((err: any) => console.log(`error:: ${err}`));
}

const addWordToRoom = (roomName: string, userName: string, word: string) => {
	const isOwner = roomCollection[roomName].owner === userName;
	console.log(isOwner);
	console.log(word);

	if (isOwner) {
		roomCollection[roomName].guess = word
	}
	return isOwner;
}
const checkForRoom = (roomName: string): boolean => Object.keys(roomCollection).includes(roomName);
const addUserToRoom = (roomName: string, userName: string) => {
	if (roomCollection[roomName].participents.includes(userName) === false) roomCollection[roomName].participents.push(userName);
};
const createRoom = (roomName: string, owner: string) => {
	console.log('nova soba');
	console.log(owner);
	const room = {
		owner,
		guess: 'SOBA',
		participents: [owner]
	}
	roomCollection[roomName] = room;
}
const onConnect = (roomName: string, userName: string) => {
	try {
		if (checkForRoom(roomName)) addUserToRoom(roomName, userName);
		else createRoom(roomName, userName);
		return true

	} catch (error) {
		console.log(error);
		return false
	}
}



app.get('/getUserImages', async (req,res) => {
	const results:any = []
	const DBRes = await ImageModel.findAll({
		where:{
			user:req.query.user
		}
	});
	DBRes.forEach((element: any) => {
		results.push(element);
	})
	res.send(JSON.stringify({result:results}))
})
server.listen("4002", () => {
	// sluzi za soket konekcije
	console.log('socket port: 4002');
});
app.listen('4003', () => {
	// express server za post i get requestove
	authenticateDB()
	console.log('express port 4003');
})

io.on('connection', (socket: any) => {
	socket.on('joinRoom', (socketEvent: any) => {
		onConnect(socketEvent.roomName, socketEvent.userName)
		socket.join(socketEvent.roomName); //dodaje korisnika u sobu
		logger.addTextLog(`user ${socketEvent.userName} joined ${socketEvent.roomName}`)
	})
	socket.on('drawing', (drawData: any) => {
		socket.to(drawData.userInfo.roomName).emit('drawing', drawData.drawingData); // draw event
	})
	socket?.on("drawRectangle", (data: any) => {
		socket.to(data.userInfo.roomName).emit('drawRectangle', data); // draw event
	});
	socket?.on("moveBrush", (data: any) => {
		socket.to(data.userInfo.roomName).emit('moveBrush', data.brushPos); // draw event
	});
	socket?.on("paintCanvas", (data: any) => {
		socket.to(data.userInfo.roomName).emit('paintCanvas', data.color); // draw event
	});
	socket?.on("sendChatMessage", (data: any) => {
		io.to(data.roomName).emit('sendChatMessage', data);
		logger.addTextLog(`chat message > ${data.body} by user ${data.userName} in room: ${data.roomName}`)
	});
	socket?.on("userGuess", (data: any) => {
		const { userName, roomName, guess } = data;
		if (addWordToRoom(roomName, userName, guess) === false) {
			if (roomCollection[roomName].guess === guess) {
				io.to(data.roomName).emit('correctGuess', { winnerName: userName, guess });
			}
		}
	});
	socket.on("saveImage", (imageData: any) => {
		const { userName, imageString } = imageData;
		const buffer = Buffer.from(imageString, "base64");
		// Pipes an image with "new-path.jpg" as the name.
		const date = new Date()
		const path = `images/${userName}-${date.getDay()}-${date.getMonth()}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.png`
		fs.writeFileSync(`./public/${path}`, buffer);
			ImageModel.create({ path,user:userName }).then(() => {
			console.log('created Image');
			logger.addTextLog(`${userName} saved ${path} to filesistem `)
		}).catch((err: any) => console.log(err))
	})
})
