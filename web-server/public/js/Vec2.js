/**
 * Created by Zachary on 4/9/2014.
 */
Vec2 = function(x,y){
    this.x = x;
    this.y = y;
};

Vec2.prototype = {
    set: function(x,y){
        this.x = x;
        this.y = y;
    },
    setToVec2: function(vector){
        this.x = vector.x;
        this.y = vector.y;
    },
    getDistance: function(other){
        var deltaX = other.x - this.x;
        var deltaY = other.y -  this.y;
        return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
    },
    getX: function(){
        return this.x;
    },
    getY: function(){
        return this.y;
    }
}