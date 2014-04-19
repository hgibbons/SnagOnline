var Code = require('../../../../../shared/code');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
    this.serverId = app.get('serverId').split('-')[2];
};


// generate playerId
var id = 1;

/**
 * New client entry game server. Check token and bind user info into session.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
    var self = this;
    var playerId = parseInt(this.serverId + id, 10);
    id += 1;
    session.bind(playerId);
    session.set('playerId', playerId);
    //session.set('playername', msg.name);
    session.set('boardId', 1);
    session.on('closed', onUserLeave.bind(null, self.app));
    session.pushAll();
    next(null, {code: Code.OK, playerId: playerId});
};

var onUserLeave = function (app, session, reason) {
    if (session && session.uid) {
        app.rpc.game.playerRemote.playerLeave(session, {playerId: session.get('playerId'), areaId: session.get('areaId')}, null);
    }
};
