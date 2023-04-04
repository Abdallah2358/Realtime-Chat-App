const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
mongoose
    .connect((process.env.cString ? process.env.cString : "mongodb://127.0.0.1:27017/test"))
    .catch((err) => {
        console.log("Mongoose Error", err);
    })
mongoose.connection.on('error', (err) => {
    console.log(err);
});
const Message = mongoose.model('Message', { name: String, message: String });

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
    Message.find({}).then((messages) => {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    console.log(req.body);

    const message = new Message(req.body);
    message.save().then(() => {
        io.emit('message', req.body);
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
    })

})
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

