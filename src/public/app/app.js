const socket = io('/');
const peer = new Peer(undefined, {
    host:'/',
    port: '3001'
});

const peers = {};
const videoLocal = document.getElementById('localVideo');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
let myVideoStream;

//Tell to server
peer.on('open', id=>{
    console.log("peerid: ", id);
    socket.emit('JOIN_ROOM', ROOM_ID, id);
    peerId = id;
});

//Open stream
function openStream(){
    const contraints = {audio: true, video: true};
    return navigator.mediaDevices.getUserMedia(contraints);
}

function playRemoteStream(video, stream) {
    video.srcObject = stream;
    video.play();
    videoGrid.append(video);
}
function playLocalStream(video, stream) {
    video.srcObject = stream;
    video.play();
    videoLocal.append(video);
    videoLocal.children[1].nextElementSibling.setAttribute('id','localStream');
}
function connecToNewUser(userId, stream){
    const call = peer.call(userId, stream);

    const videoCaller = document.createElement('video');
    call.on('stream', userVideoStream => playRemoteStream(videoCaller,userVideoStream));
    call.on('close', ()=>{
        videoCaller.remove();
    })
    peers[userId] = call;
}

openStream()
    .then(stream => {
        myVideoStream = stream;
        playLocalStream(myVideo, stream);
 
        //Listen Server
        socket.on('USER_CONNECTED', userId => {
            console.log("user: ", userId);
            //make a call to other user
            connecToNewUser(userId, stream);
        });

        //answer call from people
        peer.on('call', call=>{
            // Answer the call, providing our mediaStream
            call.answer(stream);
            
            const videoCaller = document.createElement('video');
            call.on('stream', userVideoStream => playRemoteStream(videoCaller,userVideoStream));
        });
    });

// ----------------CALL ACTION-----------------

//Disconnect
socket.on('USER_DISCONNECT', userId=>{
    if(peers[userId]) peers[userId].close();
});

function stopCalling(){
    $('#localCamContainer').attr('action','stop');
}

//Hide cam and mute mic
function hideWebcam(){
    event.preventDefault();
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setHideCamButton();
    } else {
      myVideoStream.getVideoTracks()[0].enabled = true;
      setShowCamButton();
    }
}
function muteUnmute(){
    event.preventDefault();
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setMuteButton();
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        setUnmuteButton();
    }
}

const camButton = document.getElementById('webCam');
const audioButton = document.getElementById('audioCall');
function setHideCamButton(){
    camButton.children[0].remove();
    const html = `<i class="fas fa-video-slash"></i>`;
    camButton.innerHTML = html;
}
function setShowCamButton(){
    camButton.children[0].remove();
    const html = `<i class="fas fa-video"></i>`;
    camButton.innerHTML = html;
}
function setMuteButton(){
    audioButton.children[0].remove();
    const html = `<i class="fas fa-microphone-slash"></i>`;
    audioButton.innerHTML = html;
}
function setUnmuteButton(){
    audioButton.children[0].remove();
    const html = `<i class="fas fa-microphone"></i>`;
    audioButton.innerHTML = html;
}




// ----------------CHAT-----------------
const inputTxt = document.getElementById("inputTxt");
const btnSend = document.getElementById("sendTxt")
inputTxt.addEventListener("keyup", function(event) {
    if (event.keyCode === 13 && inputTxt.value != "") {
            event.preventDefault();
            socket.emit('SEND_TEXT', peerId, inputTxt.value);
            inputTxt.value = "";
    }
});

function sendAction(){
    if(inputTxt.value != ""){
        socket.emit('SEND_TEXT', peerId, inputTxt.value);
        inputTxt.value = "";
    }
}

socket.on('SHOW_TEXT', (id, text) => {
    const userId = id.slice(9, 13);
    const txt = '<h6 style="font-weight: bold; margin-bottom: 0rem;"> user ' + userId +'</h6>'+'<p>' + text +'</p>';
    $('#messTxt').append(txt);
    $("#messTxt").animate({scrollTop: $("#messTxt").height()}, 800);
});
// ---------------- CHAT ACTION-----------------
//Option chat and video
const chat = document.getElementById('chat');
const extension = document.getElementById('extension');
const userChat = document.getElementById('user-container');
const hideChat = document.getElementById('hideChat');
const openChat = document.getElementById('openChat');
const option1 = document.getElementById('option1');
const option2 = document.getElementById('option2');
option1.onclick = function(){
    chat.style.display = "block";
    videoGrid.style.display = "none";
}
option2.onclick = function(){
    chat.style.display = "none";
    videoGrid.style.display = "block";
}
hideChat.onclick = function(){
    userChat.style.width = "0vw";
    userChat.style.transitionDuration = "500ms";
    videoLocal.style.width = "100vw";
    videoLocal.style.transitionDuration = "500ms";
    extension.style.display = "block";
}
openChat.onclick = function(event){
    event.preventDefault();
    userChat.style.width = "40vw";
    userChat.style.transitionDuration = "500ms";
    videoLocal.style.width = "70vw";
    videoLocal.style.transitionDuration = "500ms";
    extension.style.display = "none";
}

