(function(window)
{
function Car( y, type, level )
{
var _this = this;

this.shape = null;
this.type = type;

this.info = Car.TYPES[ type ];
this.width = this.info.width;
this.height = this.info.height;

this.setupShape();

this.shape.x = 0;
this.shape.y = y - this.height / 2;

var travelDuration = level.road.width / this.info.speed * 1000;

createjs.Tween.get( this.shape ).to( { x: level.road.width }, travelDuration ).call( function()
    {
    level.removeCar( _this );
    });
}

Car.TYPES = {
    one: {
        color: 'red',
        speed: 50,
        width: 30,
        height: 10
        },
    two: {
        color: 'gray',
        speed: 100,
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


window.Car = Car;

}(window));
