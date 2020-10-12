const db = "http://localhost:3000/users";

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



//Open peer
peer.on('open', (id) => {
    console.log(id);
    peerId = id;
});

function writePeerId(id) {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    };
    fetch(db, option)
      .then((res) => res.json())
      .then(data=>console.log(data));
}

const idRoom = "rjpml8acpm000000";
const newUser = {userId: "12us82hdxsx"};
function updateUser(id, newUser) {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    };
    fetch(db + "/" + id, option)
      .then((res) => res.json())
      .then(data=>console.log("data is : ", data))
      .catch(err => console.log("err is : ", err.message));
}

updateUser(idRoom, newUser);


let room_data = [];
function getData() {
    fetch(db)
      .then((res) => res.json())
      .then(data => room_data = data)
      .catch(err => console.log(err.message));
}

function showRoomId(arr, id){
    const html = arr.find(room => room.id==id);
    $('#meetingId').append(`<p>${html}</p>`);
}

$('#newMeeting').click(()=>{
    const format = {id: peerId, userId: [peerId]};
    writePeerId(format);
    getData();

    $('.home').css('display','none');
    $('.waiting').css('display','block');
    openStream()
        .then(stream=>{
            playStream('localStream', stream);
            const room = room_data.find(r => r.id = format.id);
            $('#meetingId').append(`<p>${room.id}</p>`);
            $('#createRoom').attr('action', `${format.id}`);
        });
});

// $('#newMeeting').click(()=>{
//     $('#createRoom').attr('action', `${format.id}`);
// });

// $('#createRoom').attr('action',`${peerId}`);
// Call to someone
$('#join').click(()=>{
    const inputID = $('#inputId').val();
    const format = {id: inputID, userId: [peerId]};
    updateUser(format.id, {userId: [peerId]});
    // $('#joinForm').attr('action',`/${inputID}`);
});
