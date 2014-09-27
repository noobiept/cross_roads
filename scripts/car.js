(function(window)
{
function Car( y, type )
{
this.shape = null;
this.type = type;

this.info = Car.TYPES[ type ];
this.width = this.info.width;
this.height = this.info.height;

this.setupShape();

this.shape.x = 0;
this.shape.y = y;
}

Car.TYPES = {
    one: {
        color: 'red',
        speed: 5,
        width: 30,
        height: 10
        },
    two: {
        color: 'gray',
        speed: 10,
        width: 20,
        height: 10
        }
};

Car.prototype.setupShape = function()
{
var shape = new createjs.Shape();
var info = this.info;

var g = shape.graphics;

g.beginFill( info.color );
g.drawRect( 0, 0, info.width, info.height );
g.endFill();

G.STAGE.addChild( shape );

this.shape = shape;
};


Car.prototype.clear = function()
{
G.STAGE.removeChild( this.shape );
};

Car.prototype.getX = function()
{
return this.shape.x;
};

Car.prototype.getY = function()
{
return this.shape.y;
};



Car.prototype.tick = function()
{
this.shape.x += this.info.speed;

if ( this.shape.x > G.CANVAS.width )
    {
    this.clear();
    return true;
    }

return false;
};


window.Car = Car;

}(window));
