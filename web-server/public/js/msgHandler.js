msgHandler = function(){
	this.pomelo = window.pomelo;
	this.app = require('app');
}

msgHandler.prototype = {
	init: function(board){
		//This will be called when the user connects to the server, it will be given an argument of an array
		//Of the current players on the server and if they are not found in the clients game then they
		//will be added.
		pomelo.on('addPlayers', function(players) {
			var board = board;
			for (var i = 0; i < players.length; i++) {
				var player = board.getPlayer(players[i].playerId);
				if(!player)
					board.addEntity(players[i]);
			}
		}
		//This will be called when there is an entity that needs to be removed.
		//Checks if the entity is not the local player then tries to remove it.
		pomelo.on('removePlayers', function(playerIds){
			var board = board;
			var currentPlayer = board.getLocalPlayer();
			for( var x = 0; x < playerIds.length; x++){
				if(playerIds[i] != player.getId()){
					board.removePlayer(playerIds[x]);
				}
			}
		}
		pomelo.on('onMove', function(playerId, x, y){
			
		}
	},
}