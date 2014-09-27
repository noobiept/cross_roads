(function(window)
{
function Car( y, type )
{
this.shape = null;
this.type = type;
this.speed = Car.TYPES[ type ].speed;

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
var info = Car.TYPES[ this.type ];
var shape = new createjs.Shape();

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


Car.prototype.tick = function()
{
this.shape.x += this.speed;

if ( this.shape.x > G.CANVAS.width )
    {
    this.clear();
    return true;
    }

return false;
};


window.Car = Car;

}(window));
