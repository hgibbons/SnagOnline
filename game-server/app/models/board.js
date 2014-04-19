/**
 * Created by Zachary on 4/18/2014.
 */
var pomelo = require('pomelo');
var timer = require('./timer');
var EventEmitter = require('events').EventEmitter;


var exp = module.exports;

var id = 0;

var players = {};
var playerIds = {};
var playerIdsLength = 0;

var added = [3];
var reduced = [3];
var addedLength = 0;
var reducedLength = 0;

var channel = null;

/**
 * Init areas
 * @param {Object} opts
 * @api public
 */
exp.init = function() {
    console.log("RUNNING TIMER!");
    id = 1;
    timer.run();
};

var getChannel = exp.getChannel= function() {
    if(channel) {
        return channel;
    }
    channel = pomelo.app.get('channelService').getChannel('board_' + id, true);
    return channel;
};

function addEvent(player) {

}

/**
 * Add entity to area
 * @param {Object} e Entity to add to the area.
 */
exp.addEntity = function(e) {
    if (!e || !e.playerId) {
        console.log("UNSUCCESSFULLY ADDED A PLAYER");
        return false;
    }
    e.idPosition = addedLength;
    players[e.playerId] = e;
    playerIds[playerIdsLength] = e.playerId;
    playerIdsLength++;
    getChannel().add(e.id, e.serverId);
    added[addedLength] = e;
    addedLength++;
    console.log("Added Length: " + addedLength);
    console.log("SUCCESSFULLY ADDED A PLAYER");
    console.log(e.playerId);
    console.log(players[e.playerId].myName);
    this.entityUpdate();
    return true;
};
/**
 * Remove Entity form area
 * @param {Number} entityId The entityId to remove
 * @return {boolean} remove result
 */
exp.removeEntity = function(entityId) {
    var e = players[entityId];
    if (!e) {
        return true;
    }
    var idPosition = e.idPosition;
    getChannel().leave(e.id, e.serverId);
    playerIds[idPosition] = -1;
    reduced.push(entityId);
    reducedLength++;
    this.entityUpdate();
    return true;
};
exp.entityUpdate = function() {
    if (addedLength > 0) {
        console.log("Found a player we need to add to the channel!");
        getChannel().pushMessage({route: 'addPlayers', entities: added});
        added = [3];
        addedLength = 0;
    }
    if (reducedLength > 0) {
        getChannel().pushMessage({route: 'removePlayers', entities: reduced});
        reduced = [3];
        reducedLegnth = 0;
    }
};
var tickCount = 0;

/**
 * Get entity from area
 * @param {Number} entityId.
 */
exp.getEntity = function(entityId) {
    return players[entityId];
};

/**
 * Get entities by given id list
 * @param {Array} The given entities' list.
 */
exp.getEntities = function(ids) {
    var result = [];
    for (var i = 0; i < ids.length; i++) {
        var entity = players[ids[i]];
        if (entity) {
            result.push(entity);
        }
    }
    return result;
};

exp.getAllPlayers = function() {
    return players;
};

exp.getPlayer = function(playerName) {
    for(var x = 0; x < playerIdsLength; x++){
        if(playerIds[x] != -1 && players[playerIds[x]].myName == playerName) {
            return players[playerIds[x]];
        }
    }
};

exp.removePlayer = function(playerId) {
    var entityId = players[playerId];

    if (entityId) {
        delete players[playerId];
        this.removeEntity(entityId);
    }
};

/**
 * Get area entities for given postion and range.
 */
exp.players = function () {
    return players;
};

exp.timer = function() {
    return timer;
};

exp.getAreaInfo = function() {
    var players = this.getAllPlayers();
    return {
        id: id,
        players : players
    };
};