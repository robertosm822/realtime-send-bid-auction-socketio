const app = require('express')();
const http = require('http').createServer(app);

const io = require('socket.io')(http);

app.get('/', (req, res) => {
   res.sendFile(__dirname+'/index.html');
});
app.get('/client', (req, res) => {
    res.sendFile(__dirname+'/client.js');
 });

io.on('connection', (socket) => {
    console.log('New Connction', socket.id);
    //ouvir as mensagens vindas do client HTML
    socket.on('bid_value', (msg) =>{
        socket.broadcast.emit('bid_value',msg);
    });
});

http.listen(3001, function(){
    console.log('Ouvindo a porta 3001');
});