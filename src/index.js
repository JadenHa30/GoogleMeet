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

function getUser(users){
    users.forEach(user => {
        return user.id;
    });
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/resources/main.html');
});

users.map(user => {
    app.get(`/${user.id}`, (req, res) => {
        res.sendFile(__dirname + '/resources/meeting.html');
    });
})


// io.on('connection', socket => {
//     socket.on('CREATE_ROOM', data=>{
//         const arrRooms = [];
//         for(room in socket.adapter.rooms){
//             arrRooms.push(room);
//         }
        
//         socket.join(data.id);
//         app.get(`/${data.id}`, (req, res) => {
//             res.sendFile(__dirname + '/resources/meeting.html');
//         });
//         console.log("all rooms = ", socket.adapter.rooms);

//         // answer to client
//         io.sockets.emit('SERVER_ROOMS', arrRooms);
//         socket.emit('USER_ROOM', data.id);
//     });
// });
