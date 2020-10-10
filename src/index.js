const express = require("express");
const socket = require("socket.io");

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


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/resources/main.html');
});

io.on('connection', socket => {
    socket.on('USER_JOIN', user=>{
        arr.push(user);

        //answer to client
        socket.emit('LIST_USERS_ONLINE', arr);
    });
});

