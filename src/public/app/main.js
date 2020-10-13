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

//---------------POST----------------
function createData(data) {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(db, option)
      .then((res) => res.json())
      .then(data=>console.log(data));
}

//---------------POST----------------
function update(id, data) {
  const option = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(db + "/" + id, option)
    .then((res) => res.json())
    .then(data=>console.log(data));
}

//---------------GET----------------
let room_data = [];
function getData() {
    fetch(db)
      .then((res) => res.json())
      .then(data => room_data = data)
      .catch(err => console.log(err.message));
}
getData();


$('#startMeeting').click(()=>{
    const format = {id: peerId, userId: [peerId]};
    createData(format);
 
    $('.home').css('display','none');
    $('.waiting').css('display','block');
    openStream()
        .then(stream=>{
            playStream('localStream', stream);
            $('#meetingId').append(`<p>${format.id}</p>`);
            // $('#createRoom').attr('action', `${format.id}`);
        });

    
});


// // Call to someone
$('#joinLink').click(()=>{

  //create new data to update to server
    const inputID = $('#inputId').val();
    const data_filter = room_data.find(data => data.id == inputID);
    console.log(data_filter);
    const newUserIds = [...data_filter.userId, peerId];
    room_data.map(data => {
      return data.id == inputID ? (data.userId = newUserIds) : data;
    });
    const newData = room_data.find(data => data.id == inputID);
    update(inputID, newData);

    $('.home').css('display','none');
    $('.waiting').css('display','block');
    openStream()
        .then(stream=>{
            playStream('localStream', stream);
            $('#meetingId').append(`<p>${data_filter.id}</p>`);
            // $('#createRoom').attr('action', `${data_filter.id}`);
        });
});
