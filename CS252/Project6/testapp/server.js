const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const api = require('./server/routes/api');

const app = express();

const server = http.createServer(app);

var io = require('socket.io')(server);

var usernum = 0;
var remainStep = 40;
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'src')));


io.on('connection', function(socket){
    usernum++;
    if(usernum >= 2){
        console.log('start');
        io.emit('start');
    }
    socket.on('disconnect', function(){
        usernum--;
      console.log("disconnected");
    });
    socket.on('move', (id, i, j) => {
        remainStep--;
        console.log(remainStep);
        if(remainStep == 0){
            console.log("end");
            io.emit('end');
        }else{
            io.emit('next', id, i, j);
        }
        
    });
});

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));