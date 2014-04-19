/**
 * Module dependencies
 */
var board = require('../../../models/board');
var consts = require('../../../consts/consts');
var utils = require('../../../util/utils');


var exp = module.exports;

/**
 * Player exits. It will persistent player's state in the database. 
 *
 * @param {Object} args
 * @param {Function} cb
 * @api public
 */
exp.playerLeave = function(args, cb) {
	var boardId = args.boardId;
	var playerId = args.playerId;
	var player = board.getPlayer(playerId);

	if (!player) {
		utils.invokeCallback(cb);
		return;
	}
	board.removePlayer(playerId);
	board.getChannel().pushMessage({route: 'onUserLeave', code: consts.MESSAGE.RES, playerId: playerId});
	utils.invokeCallback(cb);
};

