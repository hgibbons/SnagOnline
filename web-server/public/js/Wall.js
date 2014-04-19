/**
 * Created by Zachary on 4/9/2014.
 */
Wall = function(game,board,x,y){
    this.game = game;
    this.board = board;
    this.sprite = null;
    this.worldPosition = new Vec2(0,0);
    this.create(x,y);
};

Wall.prototype = {
    create: function(x,y){
        this.sprite = game.add.sprite(x,y,'wall');
        this.sprite.body.collideWorldBounds = false;
        this.sprite.body.immovable = true;
        this.worldPosition.set(this.sprite.x, this.sprite.y);
    },
    update: function(newScale){
        this.scale(newScale);
    },
    scale: function(newScale){
        var distanceToCenter = this.worldPosition.x - this.board.userPosition.x;
        var newDistanceToCenter = distanceToCenter / newScale;
        this.sprite.x = 350 + newDistanceToCenter;
        this.sprite.y = 0;
        this.sprite.scale.setTo(1/newScale,1);
        this.sprite.body.updateBounds(1/newScale,1);
    }
}