const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);

const path = require('path');
const {v4: uuidV4} = require('uuid');

//view engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "resources", "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res)=>{
    res.render('home');
});

app.get('/meeting', (req, res)=>{
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res)=>{
    res.render('room', {roomId: req.params.room});
});

app.get('/stop-call', (req,res)=>{
    res.render('endPage');
});

io.on('connection', socket=>{
    socket.on('JOIN_ROOM', (roomId, userId)=>{
        socket.join(roomId);
        socket.room = roomId;

        //send to a specific room, .broadcast means to all users in the room
        socket.to(roomId).broadcast.emit('USER_CONNECTED', userId);

        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('USER_DISCONNECT', userId);
        })
    });
    socket.on('SEND_TEXT', (id, text) =>{
        io.sockets.in(socket.room).emit('SHOW_TEXT', id, text);
    })
});

server.listen(3000);

