//pomelo-cli -h 127.0.0.1 -P 3005 -u monitor -p monitor


// Module dependencies
var board = require('../../../models/board');
var Player = require('../../../models/player')
var app = require('pomelo').app;
var consts = require('../../../consts/consts');
var fs = require('fs');

var handler = module.exports;

/**
 * Player enter scene, and response the related information such as
 * playerInfo, areaInfo and mapData to client.
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @api public
    */
handler.enterScene = function(msg, session, next) {
  var player = new Player({id: msg.playerId, myName: msg.myName});
  player.serverId = session.frontendId;
  // console.log(player);
  console.log("about to try to addEntity" + msg.myName)
  if (!board.addEntity(player)) {
    next(new Error('fail to add user into area'), {
      route: msg.route,
      code: consts.MESSAGE.ERR
    });
    return;
  }

  next(null, {
    code: consts.MESSAGE.RES,
    data: {
      area: board.getAreaInfo(),
      playerId: player.id
    }
  });
};

/**
 * Player moves. Player requests move with the given movePath.  
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @api public
 */
handler.move = function(msg, session, next) {
  var x = msg.x;
  var y = msg.y;
  var playerId = msg.playerId;
  var player = board.getPlayer(msg.myName);
  if (!player) {
    //next(new Error('invalid player:' + playerId), {
    //  code: consts.MESSAGE.ERR
    //});
      console.log("COULD NOT FIND PLAYER!!");
    return;
  }
    console.log("Pushing a message to players that " + player.playerId + " moved.");
  board.getChannel().pushMessage({route: 'onMove',playerId: player.playerId,name: player.myName,x: x,y: y});
};

