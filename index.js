const app = require('express')();
const server = require('http').createServer(app);
const cors = require("cors")

const io = require("socket.io")(server,{
    cors:{
        origin:"*",
        methods: [ "GET", "POST"]
    }
})


app.use(cors())

const PORT = process.env.PORT || 5000;

app.get("/", (req,res) => {
    res.send('Server is running')
})

io.on('connection',(socket) =>{
    socket.emit('me', socket.id);
    console.log(socket.id)

    socket.on('disconnect',() =>{
        socket.broadcast.emit("callended")
        console.log('disconnect')
    })

    socket.on('calluser', ({ userToCall, signalData,from,name }) =>{
        io.to(userToCall).emit("calluser", { signal: signalData, from ,name });
        console.log('call user')
        console.log(userToCall)
    })

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
        console.log(data.to)
        console.log('answer call')
    })
});

server.listen(PORT, () => console.log(`Server is listing on port ${PORT}`));

