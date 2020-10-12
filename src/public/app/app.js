const socket = io();

//Listen data from server

// socket.on('USER_ROOM', data => {
//     $('#meetingId').html(data);
// });
// socket.on('SERVER_ROOMS', data => {
//     data.map(room=>$('#currentRoom').append(`<p>Room: ${room}<p>`));
// });

// -----------Stream------------

//Open stream
function openStream() {
    const constraints = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(constraints);
}

function playStream(idVideoEl, stream) {
    const video = document.getElementById(idVideoEl);
    video.srcObject = stream;
    video.play();
}

openStream()
    .then(stream=>playStream('localStream', stream));


//Call
$('#joinMeeting').click(()=>{
     $('#localStream').css('width','100vw');
     $('#localStream').css('width','100vw');
     $('#localStream').css('height','100vh');
     $('header').css('display','none');
     $('.container').removeClass('mt-5');
     $('.info').css('display','none');
});






