Board = function(game){
    this.preloadImages = ['background','blank','hook','wall','user','ground','score'];
    this.preloadSFX = ['point','jump','die','hit'];
    this.numberOfHooks = this.numberOfWalls  = this.userScore = this.previousTime = 0;
    this.boardScale = 1.4;
    this.userPosition = new Vec2(0,0);
    this.game = game;
    this.hooks = [];
    this.walls = [];
	this.user = new User(this.game,this);
    /*---------------------NODE.JS----------------------*/
	this.pomelo = window.pomelo;
    this.GATE_HOST = window.location.hostname;
    this.GATE_PORT = 3014;
	this.entities = [];
    this.score;
    this.run = false;
};

Board.prototype = {
    preload: function(){
        this.preloadImages.forEach(function(x){this.game.load.image(x,'images/' + x + ".png")});
        this.preloadSFX.forEach(function(x){this.game.load.audio(x,'sfx/' + x + '.wav')});

    },
    create: function(){

        this.userPosition = new Vec2(0,0);
        this.sprite = this.game.add.sprite(0,0,'background');
        this.groundSprite = this.game.add.sprite(0,350,'ground');
        this.groundSprite.body.collideWorldBounds = false;
        this.groundSprite.body.immovable = true;
        this.previousTime = (this.game.time.time / 100);
        for(var x = 0; x < 3; x++){ //Can instantiate from XML later.
            this.hooks[x] = new Hook(this.game,this,300 + (x*600),100);
            this.numberOfHooks++;
        }
        for(var x = 0; x < 2; x++){ //Can instantiate from XML later.
            this.walls[x] = new Wall(this.game,this,-300 + (x*2100),0);
            this.numberOfWalls++;
        }
        this.scoreSprite = this.game.add.sprite(0,12,'score');
        this.scoreLabelString = "0";
        this.style = {font: "30px Arial",fill: "#dad6cb", align: "left"};
        this.score = this.game.add.text(75,11,this.scoreLabelString,this.style);

        /*---------------------NODE.JS----------------------*/
        this.user.create();
        this.uiInit();
        this.setEventHandlers();
    },
    update: function(){
        this.score.setText(this.userScore);
        this.elapsedTime = (this.game.time.time / 100) - this.previousTime;
        this.previousTime = (this.game.time.time / 100); //Too bad game.time.elapsed is deprecated.
        this.scale(this.boardScale);
        if(this.run == true)
            this.user.update();
        /*---------------------NODE.JS----------------------*/
    },
    scale: function(newScale){
        for(var x  = 0; x < this.numberOfHooks; x++){
            this.hooks[x].update(this.boardScale);
        }
        for(var x  = 0; x < this.numberOfWalls; x++){
            this.walls[x].update(this.boardScale);
        }
        this.groundSprite.scale.setTo(1,1/newScale);
        this.groundSprite.y = 400 - (50/newScale);
    },
	setUser: function(user){
		this.user = user;
	},
    /*---------------------NODE.JS----------------------*/
	//Searches through all players (network players) for a certain player.
	getPlayer: function(playerId){
		for(var x = 0; x < entities.length; x++){
			if(entities[x].playerId == playerId)
				return entities[x];
		}
		return null;
	},
	//Returns the local player.
	getLocalPlayer: function(){
		return this.user.getEntity();
	},
	//Removes a network player
	removePlayer: function(playerId){
		for(var x = 0; x < entities.length; x++){
			if(entities[x].playerId == playerId){
				entities[x].remove();
			}
		}
	},
	setEventHandlers: function(){
		//This will be called when the user connects to the server, it will be given an argument of an array
		//Of the current players on the server and if they are not found in the clients game then they
		//will be added.
		this.pomelo.on('addPlayers', function(players) {
            console.log("Getting on added User signal from server!");
            for (var i = 0; i < players.length; i++) {
				var player = board.getPlayer(players[i].playerId);
				if(!player)
					this.addEntity(players[i]);
			}
		});
		//This will be called when there is an entity that needs to be removed.
        //Checks if the entity is not the local player then tries to remove it.
		this.pomelo.on('removePlayers', function(playerIds){
			var currentPlayer = this.getLocalPlayer();
			for( var x = 0; x < playerIds.length; x++){
				if(playerIds[i] != currentPlayer.entity.getPlayerId()){
					this.removePlayer(playerIds[x]);
				}
			}
		});
		this.pomelo.on('onMove', function(data){
            var x = data.x;
            var y = data.y;
            var playerId = data.playerId;
            var name = data.name;
            console.log("Getting on move signal from server! User: " + name + " X: " + x + " Y: " + y);
            //This is not being called in context.
			//if(entity){
			//	entity.setPosition(x,y);
			//}
		});
	},
	entry: function(name, callback){
        pomelo.init({host: this.GATE_HOST, port: this.GATE_PORT, log: true}, function() {
            pomelo.request('gate.gateHandler.queryEntry', {uid: name}, function(data) {
                console.log("In Next YES!");
                pomelo.disconnect();
                if (data.code === 2001) {
                    alert('server error!');
                    return;
                }
                if (data.host === '127.0.0.1') {
                    data.host = location.hostname;
                }
                pomelo.init({host: data.host, port: data.port, log: true}, function() {
                    if (callback) {
                        callback();
                    }
                });
            });
        });
	},
	uiInit: function(){
		var name = 'gaate';
                this.entry(name, function() {
                    pomelo.request('connector.entryHandler.entry', {myName: name}, function(data) {
                    pomelo.request("game.playerHandler.enterScene", {myName: name, playerId: data.playerId}, function(data){
                        //this.app.init(data.data);
                        //this.user.playerId = data.playerId;
                        //this.boardInit();
                    });
                });
        });
        this.boardInit();
	},
	boardInit:function(){
		this.pomelo.playerId = this.user.entity.playerId;

	},
    getEntity: function(playerId){
        for(var x = 0; x < this.entities.length; x++){
            if(this.entities[x].playerId == playerId)
                return this.entities[x];
        }
    }
}