var pomelo = require('pomelo');
var board = require('./app/models/board');


/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'Bare');

app.configure('production|development', 'gate', function(){
  app.set('connectorConfig', {
      connector : pomelo.connectors.hybridconnector
  });
});

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
});

app.configure('production|development', 'game', function(){
    board.init();
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
