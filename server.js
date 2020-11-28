const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}= require('./utils/users');

//initializing variables for those module

const app=express();
const server=http.createServer(app);
const io=socketio(server);

//Set Static folder
app.use(express.static(path.join(__dirname,'Public')));

//Run when client connects
const botName='Ashbot';

io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);


    //Welcome current user
    socket.emit('message',formatMessage(botName, "Welcome to  Ashwin's Letz Goo"));
    //Broadcast when user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} joined the chat`));
    
    //displaying users name and room information
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    });
});
       
    //listen  for chat message
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
    //Runs when user left 
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
        }
        //displaying users name and room information
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    });
});
    

});
const PORT=3000 ||process.env.PORT;
server.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
