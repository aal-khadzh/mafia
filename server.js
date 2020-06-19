const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let gameSet = {};
let clients = [];

io.on('connection', socket => {
  console.log(JSON.stringify(socket.id) + ' connected');
  clients.push(socket);
  socket.on('channel', data => {
    const inputKeys = Object.keys(data);
    inputKeys.forEach(key => {
      gameSet[key] = data[key];
    });
    socket.broadcast.emit('channel', data);
  });
  socket.on('user', userData => {
    const users = gameSet.users.map(user => user.name);
    if (users.includes(userData.name)) {
      gameSet.users = gameSet.users.map(user => {
        if (user.name === userData.name) {
          return userData;
        }
        return user;
      });
    } else {
      gameSet.users.push(userData);
    }
    socket.broadcast.emit('user', userData);
  });
  socket.on('reset', () => {
    gameSet = {};
    socket.broadcast.emit('reset');
    clients.forEach(client => client.disconnect(true));
  });
  socket.on('disconnect', function() {
    clients = clients.filter(client => client.id !== socket.id);
    console.log(JSON.stringify(socket.id) + ' disconnected');
    socket.broadcast.emit('userDisconnected', socket.id);
  });
});

nextApp.prepare().then(() => {
  app.use(bodyParser.json());

  app.get('/gameset', (req, res) => {
    res.json(gameSet);
  });

  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
