const socket = io("http://localhost:5000");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".container");

var audio = new Audio("../tone.wav");

var seen = false;
/*if the message receive the this function will append the message in the message section
based on the sender and receiver*/
const append =(message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left')
    {
        audio.play();
    }
}

//function to send the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value = '';
})

/*if user seen the message send to the server that message has been seen. 
that means if new message has came and user mouse over on the message section
message has beeb seen and send it to the server*/
messageContainer.addEventListener('mouseover',(e)=>{
    e.preventDefault();
    const message = " seen the chat";
    if(seen=== false){
    socket.emit('seen',message);
    seen=true;
    }
})

//input Name to join the chat
const user = prompt("Enter your Name to join");
socket.emit('new-user-joined', user);

//Receive the message if any new user join the chat
socket.on('user-join', name=>{
    append(`${name} joined the chat`, 'left');
})

//Receive the message if anyone send the message
socket.on('received', data=>{
    append(`${data.name}:${data.message}`, 'left');
    seen=false;
})

// show the alert message if any one seen the message
socket.on('status', data=>{
   alert(`${data.name} ${data.message}`)
})

// Receive the message if anyone disconnect from the chat
socket.on('left', name=>{
    append(`${name} left from char`, 'left');
})