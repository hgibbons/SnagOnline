/**
 * Created by Zachary on 4/9/2014.
 */
User = function(game,board){
    this.board = board;
    this.game = game;
    this.closestPosition = new Vec2(0,0);
    this.worldPosition = new Vec2(0,0);
    this.velocity = new Vec2(100,120);
    this.origin = new Vec2(0,0);
    this.previousPosition = new Vec2(0,0);
    this.bodyPreviousPosition = new Vec2(0,0);
    this.angularVelocity = this.hookArmRadius = this.hookArmAngle = 0;
    this.isKeyDown = this.isHooked = false;
    this.gravity = 15;
    this.sfx = [];
    this.turned = false;
    this.stillContacting = false;
	this.entity;
    this.sprite;
    this.playerId = 1;
	this.pomelo = window.pomelo;
    this.name;
};

User.prototype = {
    create: function(){
        this.entity = new Entity("Local User",100,100);
        this.entity.setRender(false);
        this.sprite = game.add.sprite(0,0,'user');
        this.sprite.body.bounce.setTo(0.00000001, 0.00000001);
        this.sprite.body.collideWorldBounds = false;
        this.sprite.body.immovable = false;
        this.setWorldPosition(0,150);
        this.line = new Phaser.Line();
        this.sfx['die'] = game.add.audio('die');
        this.sfx['jump'] = game.add.audio('jump');
        this.sfx['hit'] = game.add.audio('hit');
        this.playerId = 1;
        this.name = "gaate";
    },
    update: function(){
        if(this.sprite.y < 200)
            this.board.boardScale = (Math.abs(this.worldPosition.y - 100) + 400)/400;
        if(this.board.boardScale < 1.4)
            this.board.boardScale = 1.4;

        this.scale(this.board.boardScale);
        this.checkInput();
        this.move();
        this.checkCollisions();
        this.board.userPosition.setToVec2(this.worldPosition);
    },
    enter: function(){
        this.pomelo.request('game.playerHandler.enterScene', {playerId: this.playerId,name: this.name}, function(result) {
            if (result.code == 200) {
                // EntrySuccessfull
            } else {
                console.warn('curPlayer Entry error!');
            }
        });
        //this.pomelo.notify('game.playerHandler.enterScene',{playerId:this.entity.id,name: "testUserName"});
    },
    checkInput: function(){
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.isKeyDown){
            this.isKeyDown = true;
            this.isHooked ? this.release() : this.snag();
        }
        else if(!game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.isKeyDown)
            this.isKeyDown = false;
    },
    move: function() {
        this.previousPosition.set(this.worldPosition.x, this.worldPosition.y);
        this.bodyPreviousPosition.set(this.sprite.body.x, this.sprite.body.y);
        this.isHooked ? this.moveHooked() : this.moveUnhooked();
        /*---------------------NODE.JS----------------------*/
        if (this.board.run == true) {
            this.pomelo.request('game.playerHandler.move', {x: this.worldPosition.x, y: this.worldPosition.y, playerId: this.playerId, myName: this.name}, function (result) {
                if (result.code == 200) {
                    // MoveSuccessfull
                } else {
                    console.warn('curPlayer move error!');
                }
            });
        }
		//this.pomelo.notify('game.playerHandler.move',{x:0,y:0,playerId: "test"});
    },
    moveHooked: function(){
        this.hookArmAngle = this.hookArmAngle % 360;
        var angularAccelerationFromGravity = (Math.cos(this.hookArmAngle / 57.29) * this.gravity);
        this.angularVelocity -= angularAccelerationFromGravity * this.board.elapsedTime;
        this.hookArmAngle += (this.angularVelocity * this.board.elapsedTime);
        this.setPositionToNewArmAngle();
    },
    moveUnhooked: function(){
        this.velocity.y -= this.gravity * this.board.elapsedTime;
        this.setWorldPosition(this.worldPosition.x + (this.velocity.x * (1/this.board.boardScale) * this.board.elapsedTime),this.worldPosition.y - (this.velocity.y * (1/this.board.boardScale) *  this.board.elapsedTime));
    },
    setWorldPosition: function(x,y){
        this.worldPosition.set(x,y);
        this.sprite.x = 350 - 32; //The center
        this.sprite.y = 400 - ((400 - y) / this.board.boardScale);
        //this.board.userPosition.x = x + this.origin.x;
        this.board.userPosition.setToVec2(this.worldPosition);
    },
    snag: function(){
        this.findClosestHook();
        this.findAngularVelocity();
        this.isHooked = true;
        this.board.userScore++;
        this.playSFX('hit');
    },
    release: function(){
        this.isHooked = false;
        var totalVelocity = Math.abs(this.hookArmRadius * this.angularVelocity)/50;
        var sign = this.angularVelocity > 0 ? 1 : this.angularVelocity == 0 ? 0 : -1;
        var releaseAngle = this.hookArmAngle + (sign * 90);
        this.velocity.set(Math.cos(releaseAngle / 57.29) * totalVelocity, this.velocity.y = Math.sin(releaseAngle / 57.29) * totalVelocity);
        this.playSFX('jump');
    },
    findAngularVelocity: function(){
        var tempVelocity = new Vec2((0.5 * Math.sin(this.hookArmAngle / 57.29)+0.5) * this.velocity.x,(0.5 * Math.cos(this.hookArmAngle / 57.29)+0.5) * this.velocity.y);
        var tempTotal = Math.sqrt(Math.pow(tempVelocity.x,2) + Math.pow(tempVelocity.y,2));
        this.angularVelocity = (tempTotal / this.hookArmRadius) * (tempVelocity.x / Math.abs(tempVelocity.x));
        this.velocity.setToVec2(tempVelocity);
    },
    findClosestHook: function(){
        var closestHookPos = 0;
        for(var x = 0; x < this.board.numberOfHooks; x++){
            if(this.worldPosition.getDistance(this.board.hooks[x].worldPosition) < this.worldPosition.getDistance(this.board.hooks[closestHookPos].worldPosition))
                closestHookPos = x;
        }
        this.closestPosition.set(this.board.hooks[closestHookPos].worldPosition.x,this.board.hooks[closestHookPos].worldPosition.y);
        this.hookArmRadius = this.worldPosition.getDistance(this.board.hooks[closestHookPos].worldPosition) /  (1/this.board.boardScale);
        this.hookArmAngle = Math.atan((this.board.hooks[closestHookPos].worldPosition.y - this.worldPosition.y)/(this.worldPosition.x - this.board.hooks[closestHookPos].worldPosition.x)) * 57.29;
        (this.worldPosition.x - this.closestPosition.x > 0) ? this.hookArmAngle += 360 : this.hookArmAngle += 180;
    },
    setPositionToNewArmAngle: function(){
        var tempX = (Math.cos(this.hookArmAngle / 57.29) * this.hookArmRadius *  (1/this.board.boardScale)) + this.closestPosition.x;
        var tempY = (-1 * (Math.sin(this.hookArmAngle / 57.29) * this.hookArmRadius *  (1/this.board.boardScale))) + this.closestPosition.y;
        this.setWorldPosition(tempX,tempY);
    },
    reset: function(){
        this.setWorldPosition(20,100);
        this.playSFX('die');
        this.velocity.set(100,120);
        this.board.userScore = 0;
        this.isHooked = false;
        this.board.boardScale = 1.4;
    },
    checkCollisions: function(){
        this.stillContacting = false;
        this.game.physics.collide(this.sprite,this.board.groundSprite,this.collisionHandler,null,this);
        for(var x = 0; x < this.board.numberOfWalls; x++){
            this.game.physics.collide(this.sprite,this.board.walls[x].sprite,this.wallCollisionHandler,null,this);
        }
        if(this.stillContacting == false)
            this.turned = false;
    },
    collisionHandler: function(){
        this.reset();
    },
    wallCollisionHandler: function(){
        if(this.turned == false){
            this.setWorldPosition(this.previousPosition.x,this.previousPosition.y)
            this.velocity.x *= -(3/4);
            this.sprite.body.x = this.bodyPreviousPosition.x;
            this.sprite.body.y = this.bodyPreviousPosition.y;
            //this.move();
            this.turned = true;
        }
        this.stillContacting = true;
    },
    scale: function(newScale){
        this.sprite.scale.setTo(1/newScale,1/newScale);
        this.sprite.body.updateBounds(1/newScale,1/newScale);
        var distanceToGround = 400 - this.worldPosition.y;
        var newDistanceToGround = distanceToGround / newScale;
        this.sprite.y = 400 - newDistanceToGround;
    },
    playSFX: function(sfx){
        if(!this.sfx[sfx].isPlaying)
            this.sfx[sfx].play();
    },
	getEntity: function(){
		return this.entity;
	}
}