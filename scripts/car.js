(function(window)
{
/*
    args = {
        x : Number (optional= 0),
        y : Number,
        type  : String,
        level : Level
    }
 */

function Car( args )
{
if ( typeof args.x === 'undefined' )
    {
    args.x = 0;
    }

var _this = this;

this.shape = null;
this.type = args.type;

this.info = Car.TYPES[ args.type ];
this.width = this.info.width;
this.height = this.info.height;

this.setupShape();

this.shape.x = args.x;
this.shape.y = args.y - this.height / 2;

var canvasWidth = G.CANVAS.width;

var travelDuration = (canvasWidth - args.x) / this.info.speed * 1000;


createjs.Tween.get( this.shape ).to( { x: canvasWidth }, travelDuration ).call( function()
    {
    args.level.removeCar( _this );
    });
}

Car.TYPES = {
    one: {
        image: 'car_1',
        speed: 50,
        width: 47,
        height: 24
        },
    two: {
        image: 'car_2',
        speed: 70,
        width: 47,
        height: 21
        },
    three: {
        image: 'car_3',
        speed: 100,
        width: 31,
        height: 11
        },
    four: {
        image: 'car_4',
        speed: 130,
        width: 16,
        height: 12
        },
    five: {
        image: 'car_5',
        speed: 60,
        width: 20,
        height: 16
        },
    six: {
        image: 'car_6',
        speed: 80,
        width: 31,
        height: 15
        }
};

Car.prototype.setupShape = function()
{
var info = this.info;
var shape = new createjs.Bitmap( G.PRELOAD.getResult( info.image ) );

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
