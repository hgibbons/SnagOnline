/**
 * Created by Zachary on 4/18/2014.
 */
var board = require('./Board');

var exp = module.exports;

exp.run = function() {
    setInterval(tick, 100);
};

function tick() {
    //run all the action
    board.entityUpdate();
}
