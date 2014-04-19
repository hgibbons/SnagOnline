Entity = function(game,board){
    this.game = game;
    this.board = board;
    this.sprite = null;
    this.worldPosition = new Vec2(0,0);
    this.id;
	this.playerId;
    this.doRender = true;
	this.pomelo = window.pomelo;
};

Entity.prototype = {
    create: function(playerId,x,y){
		this.playerId = playerId;
        //this.sprite = game.add.sprite(x,y,'user');
        //this.sprite.body.collideWorldBounds = false;
        //this.sprite.body.immovable = true;
        this.worldPosition.set(x, y);
    },
    update: function(newScale){
        this.scale(newScale);
    },
    scale: function(newScale){
        var distanceToCenter = this.worldPosition.x - this.board.userPosition.x;
        var newDistanceToCenter = distanceToCenter / newScale;
        var distanceToGround = 400 - this.worldPosition.y;
        var newDistanceToGround = distanceToGround / newScale;
        //this.sprite.x = 350 + newDistanceToCenter;
        //this.sprite.y = 400 - newDistanceToGround;
        this.sprite.scale.setTo(1/newScale,1/newScale);
    },
	setPosition: function(x,y){
		this.setX(x);
		this.setY(y);
	},
    setX: function(x){
        this.worldPosition.x = x;
    },
    setY: function(y){
        this.worldPosition.y = y;
    },
    getPlayerId: function(){
        return this.playerId;
    },
    setRender: function(doRender) {
        this.doRender = doRender;
        if(this.doRender == false) {
            //this.sprite.renderable = false;
        }
    }
}