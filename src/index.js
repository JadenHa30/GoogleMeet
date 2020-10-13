const express = require("express");
const socket = require("socket.io");
const db = require("./database/db.json");
const users = db.users;

// App setup
const path = require('path');
const PORT = 3001;
const app = express();
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
 });

// Socket setup
const io = socket(server);
// Static files
app.use(express.static(path.join(__dirname, "public")));

// app.use(express.urlencoded());
// app.use(express.json());

// function getUser(users){
//     users.forEach(user => {
//         return user.id;
//     });
// }

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/resources/main.html');
});

// users.map(user => {
//     app.get(`/${user.id}`, (req, res) => {
//         res.sendFile(__dirname + '/resources/meeting.html');
//     });
// })

io.on('connection', socket =>{
    socket.on('CREATE_ROOM', data =>{
        console.log("data: ",data);
        socket.join(data.userPeer);
        socket.userRoom = (data.inputLink == "") ? data.userPeer : data.inputLink;
        console.log(socket.userRoom);

        let arrRooms = [];
        for(room in socket.adapter.rooms){
            arrRooms.push(room);
        }
        // console.log(socket.adapter.rooms);
        // io.sockets.emit('SERVER_ROOMS', arrRooms);
        socket.emit('CURRENT_ROOM', socket.userRoom);
        console.log(socket.adapter.rooms);
    })

    socket.on('CHAT',(data)=>{
        io.sockets.in(socket.userRoom).emit('SERVER_TRANSFER_TEXT', data);
    });
});



