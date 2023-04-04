const express = require('express');
const bodyParser = require('body-parser');


const app = express();
// socket setup
const http = require('http');
const server = http.createServer(app).listen(3000, () => {
    console.log('server is running on http://localhost:' + server.address().port);
});
const { Server } = require("socket.io");
const io = new Server(server);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static("public"));
const root = __dirname + '/public/';

//routing
app.get('/messages', (req, res) => {
    Message.find({}).then((err, messages) => {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    io.emit('message', req.body);
    console.log('message', req.body);
    res.sendStatus(200);
})
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

