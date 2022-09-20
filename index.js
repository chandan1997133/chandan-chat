//create server
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

app.use(express.static("/frontEnd/*"));
server.listen(5000);

//it is store users list
const users = {};

io.on('connection', socket => {
    //once any user join the chat it will broadcast the message and store the user in the usrs list.
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-join', name);
    });
    // if any user send the message it will broadcast the message
    socket.on('send', message => {
        socket.broadcast.emit('received', { message: message, name: users[socket.id] });
    });

    //if any user seen the message it will broadcast the particular user senn all the message.
    socket.on('seen', message => {
        socket.broadcast.emit('status', { message: message, name: users[socket.id] });
    });

 
       
    
    /*if any user disconnect from the chat it will
      breadcast that the particual user disconnected from the chat and delet from the userslist*/
    socket.on('disconnect', message => {
        socket.broadcast.emit('left',users[socket.id] );
        delete users[socket.id]
    });
})
