const db = "http://localhost:3000/users";
const socket = io();

//Create peer
const peer = new Peer();
let peerId = 0;

//Open Stream
function openStream() {
    const constraints = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(constraints);
}

function playStream(idVideoEl, stream) {
    const video = document.getElementById(idVideoEl);
    video.srcObject = stream;
    video.play();
}

function renderCam(id){
  return $('#cameraJoin').append(`<video id="${id}"></video>`);
}

//Open peer
peer.on('open', (id) => {
    console.log(id);
    peerId = id;
});

//-------------------------------Listen from server-------------------------------

// socket.on('SERVER_ROOMS', data => {
//   $('#allRooms').html("");
//   data.map(room=>$('#allRooms').append(`<p>Room: ${room}<p>`));
// });


socket.on('CURRENT_ROOM', data => {
  $('#currentRoom').append(`<p>${data}<p>`);
});


socket.on('SERVER_TRANSFER_TEXT', data=>{
  $('#txtChat').append(`<p>${data}<p>`);
})

//-------------------------------Emit to server-------------------------------
$('#startMeeting').click(()=>{
  const format = {userPeer: peerId, inputLink: ""};
  socket.emit('CREATE_ROOM', format);

  $('.home').css('display','none');
  $('.meeting').css('display','block');
  openStream()
        .then(stream=>{
            playStream('localStream', stream);
        });
});

$('#joinLink').click(()=>{
      const inputID = $('#inputId').val();
      const format = {userPeer: peerId, inputLink: inputID};
      socket.emit('CREATE_ROOM', format);

      $('.home').css('display','none');
      $('.meeting').css('display','block');
      openStream()
        .then((stream) => {
          playStream("localStream", stream); //this is a local stream in your computer
          const call = peer.call(inputID, stream); //.call(insert the id want to call, providing our mediaStream)

          renderCam(inputID);
          //when receiver pick up the phone, we will play the stream from them
          call.on("stream", (remoteStream) =>
            playStream(inputID, remoteStream)
          );
        })
        .catch((err) => console.log(err.message));
});

peer.on("call", (call) => {
  openStream()
    .then((stream) => {
      call.answer(stream);
      playStream("localStream", stream);

      renderCam()
      //stream from the caller
      call.on("stream", (remoteStream) =>
        playStream("remoteStream", remoteStream)
      );
    })
    .catch((err) => console.log(err.message));
});

$('#sendTxt').click(()=>{
  socket.emit('CHAT', $('#chat').val());
});

