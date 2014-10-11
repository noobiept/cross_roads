(function(window)
{
function Player()
{
this.shape = null;
this.width = 20;
this.height = 20;
this.movement_step = 10;
this.movement_animation = 100;  // ease duration
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

var next = this.shape.x - this.movement_step;

if ( next < 0 )
    {
    next = 0;
    }

createjs.Tween.get( this.shape, { override: true } ).to({
        x: next
    }, this.movement_animation );
};

Player.prototype.moveRight = function()
{
if ( this.shape.x + this.width >= G.CANVAS.width )
    {
    return;
    }

var next = this.shape.x + this.movement_step;

if ( next + this.width > G.CANVAS.width )
    {
    next = G.CANVAS.width - this.width;
    }

createjs.Tween.get( this.shape, { override: true } ).to({
        x: next
    }, this.movement_animation );
};

Player.prototype.moveUp = function()
{
if ( this.shape.y <= 0 )
    {
    return;
    }

var next = this.shape.y - this.movement_step;

if ( next < 0 )
    {
    next = 0;
    }

createjs.Tween.get( this.shape, { override: true } ).to({
        y: next
    }, this.movement_animation );
};

Player.prototype.moveDown = function()
{
if ( this.shape.y + this.height >= G.CANVAS.height )
    {
    return;
    }

var next = this.shape.y + this.movement_step;

if ( next + this.height > G.CANVAS.height )
    {
    next = G.CANVAS.height - this.height;
    }

createjs.Tween.get( this.shape, { override: true } ).to({
        y: next
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

if ( keysHeld.left )
    {
    this.moveLeft();
    }

else if ( keysHeld.right )
    {
    this.moveRight();
    }

else if ( keysHeld.up )
    {
    this.moveUp();
    }

else if ( keysHeld.down )
    {
    this.moveDown();
    }
};


window.Player = Player;

}(window));
