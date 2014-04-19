/**
 * Created by Zachary on 4/18/2014.
 */
var util = require('util');
var board = require('./Board');
var EventEmitter = require('events').EventEmitter;

var id = 1;
var x;
var y;
var playerId;
var boardId;
var serverId;
var myName = ' ';
var idPosition;

/**
 * Initialize a new 'Player' with the given 'opts'.
 * Player inherits Character
 *
 * @param {Object} opts
 * @api public
 */
function Player(opts) {
    this.id = opts.id;
    this.playerId = opts.id;
    this.myName = opts.myName;
    console.log("PLAYER NAMED " + opts.myName + " ADDED TO SERVER");
    this.boardId = opts.boardId;
    this.x = opts.x;
    this.y = opts.y;
}

util.inherits(Player, EventEmitter);

module.exports = Player;

/**
 * Parse String to json.
 * It covers object' method
 *
 * @param {String} data
 * @return {Object}
 * @api public
 */
Player.prototype.toJSON = function() {
    return {
        id: this.id,
        name: this.name,
        x: this.x,
        y: this.y,
        boardId: this.boardId,
        name: this.myName
    };
};

/**
 * Get state
 *
 * @return {Object}
 * @api public
 */
Player.prototype.getPos = function() {
    return {x: this.x, y: this.y};
};

/**
 * Set positon of this entityId
 *
 * @param {Number} x
 * @param {Number} y
 * @api public
 */
Player.prototype.setPos = function(x, y) {
    this.x = x;
    this.y = y;
};

