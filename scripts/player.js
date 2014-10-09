(function(window)
{
function Player()
{
this.shape = null;
this.width = 20;
this.height = 20;
this.movement_step = 10;
this.lives = 5;

this.setupShape();
}

Player.prototype.setupShape = function()
{
var shape = new createjs.Shape();

var g = shape.graphics;

g.beginFill( 'blue' );
g.drawRect( 0, 0, this.width, this.height );
g.endFill();

G.STAGE.addChild( shape );

this.shape = shape;
};

Player.prototype.moveTo = function( x, y )
{
this.shape.x = x;
this.shape.y = y;
};

Player.prototype.moveLeft = function()
{
if ( this.shape.x <= 0 )
    {
    return;
    }

this.shape.x -= this.movement_step;
};

Player.prototype.moveRight = function()
{
if ( this.shape.x + this.width >= G.CANVAS.width )
    {
    return;
    }

this.shape.x += this.movement_step;
};

Player.prototype.moveUp = function()
{
if ( this.shape.y <= 0 )
    {
    return;
    }

this.shape.y -= this.movement_step;
};

Player.prototype.moveDown = function()
{
if ( this.shape.y + this.height >= G.CANVAS.height )
    {
    return;
    }

this.shape.y += this.movement_step;
};


Player.prototype.keyEvents = function( event )
{
var key = event.keyCode;

if ( key == Utilities.KEY_CODE.leftArrow )
    {
    this.moveLeft();
    }

else if ( key == Utilities.KEY_CODE.rightArrow )
    {
    this.moveRight();
    }

else if ( key == Utilities.KEY_CODE.upArrow )
    {
    this.moveUp();
    }

else if ( key == Utilities.KEY_CODE.downArrow )
    {
    this.moveDown();
    }
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
    console.log( 'Game over.' );
    }
};



window.Player = Player;

}(window));
