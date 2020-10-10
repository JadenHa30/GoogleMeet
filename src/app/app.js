const socket = io();


//Listen data from server

socket.on('LIST_USERS_ONLINE')


// -----------Stream------------

//Create peer
const peer = new Peer();

function openStream() {
    const constraints = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(constraints);
}

function playStream(idVideoEl, stream) {
    const video = document.getElementById(idVideoEl);
    video.srcObject = stream;
    video.play();
}

$('#newMeeting').click(()=>{
    openStream()
        .then((stream) => {
        playStream("localStream", stream);
        })
        .catch(err=>console.log(err.message));
    
})
peer.on('open', (id) => {
    console.log(id);
    $('#meetingId').append(id);

    //When a user start call
    socket.emit('USER_JOIN', {id: id});
});

//Call
$('#join').click(()=>{
    const id = $('#inputId').val()
    openStream()
        .then((stream) => {
        playStream("localStream", stream);
        const call = peer.call(id, stream); //Call to someone
        call.on("stream", joiner => playStream('joiner', joiner)); //when they pick up, we will see their stream
        })
        .catch(err=>console.log(err.message));
});

//Receiver
peer.on('call', call => {
    openStream()
        .then((stream) => {
        call.answer(stream);
        playStream("localStream", stream);

        call.on('stream', caller => playStream('joiner', caller));//Stream from caller
        })
        .catch(err=>console.log(err.message));
})

