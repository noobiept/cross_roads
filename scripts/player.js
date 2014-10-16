(function(window)
{
function Player()
{
this.shape = null;
this.width = 15;
this.height = 15;
this.movement_step = 10;
this.movement_animation = 100;  // ease duration
this.lives = 5;

this.setupShape();
}


Player.prototype.setupShape = function()
{
var shape = new createjs.Bitmap();

this.shape = shape;

this.getNewRandomShape();

G.STAGE.addChild( shape );
};

Player.prototype.getNewRandomShape = function()
{
var position = Utilities.getRandomInt( 1, 8 );

this.shape.image = G.PRELOAD.getResult( 'player_' + position );
};


Player.prototype.positionIn = function( x, y )
{
createjs.Tween.removeTweens( this.shape );

this.shape.x = x;
this.shape.y = y;
};


Player.prototype.moveTo = function( xDirection, yDirection )
{
var angle = Math.atan2( yDirection, xDirection );

var nextX = this.shape.x + Math.cos( angle ) * this.movement_step;
var nextY = this.shape.y + Math.sin( angle ) * this.movement_step;

if ( nextX < 0 )
    {
    nextX = 0;
    }

else if ( nextX > G.CANVAS.width - this.width )
    {
    nextX = G.CANVAS.width - this.width;
    }

if ( nextY < 0 )
    {
    nextY = 0;
    }

else if ( nextY > G.CANVAS.height - this.height )
    {
    nextY = G.CANVAS.height - this.height;
    }

createjs.Tween.get( this.shape, { override: true } ).to({
        x: nextX, y: nextY
    }, this.movement_animation );
};



Player.prototype.clear = function()
{
G.STAGE.removeChild( this.shape );
};


Player.prototype.getX = function()
{
return this.shape.x;
};

Player.prototype.getY = function()
{
return this.shape.y;
};

Player.prototype.oneLessLife = function()
{
this.lives--;

GameMenu.setLives( this.lives );

if ( this.lives <= 0 )
    {
    return false;
    }

return true;
};


Player.prototype.tick = function( event )
{
var keysHeld = Keyboard.KEYS_HELD;

if ( keysHeld.left && keysHeld.up )
    {
    this.moveTo( -1, -1 );
    }

else if ( keysHeld.left && keysHeld.down )
    {
    this.moveTo( -1, 1 );
    }

else if ( keysHeld.right && keysHeld.up )
    {
    this.moveTo( 1, -1 );
    }

else if ( keysHeld.right && keysHeld.down )
    {
    this.moveTo( 1, 1 );
    }

else if ( keysHeld.left )
    {
    this.moveTo( -1, 0 );
    }

else if ( keysHeld.right )
    {
    this.moveTo( 1, 0 );
    }

else if ( keysHeld.up )
    {
    this.moveTo( 0, -1 );
    }

else if ( keysHeld.down )
    {
    this.moveTo( 0, 1 );
    }
};

/*
    Bring the player's shape to the top of other elements (z-index)
 */

Player.prototype.bringToTop = function()
{
G.STAGE.addChild( this.shape );
};


window.Player = Player;

}(window));
