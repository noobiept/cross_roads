(function(window)
{
function Level( info )
{
var startX = 200;
var startY = 0;

G.PLAYER.moveTo( startX, startY );

this.start_x = info.startX;
this.start_y = info.startY;
this.cars = [];
this.road = new Road( info.road.x, info.road.y, info.road.width, info.road.height, info.road.lanes );

this.count_duration = 0;
this.cars_info = Utilities.deepClone( info.cars );

for (var a = 0 ; a < this.cars_info.length ; a++)
    {
    this.cars_info[ a ].count = 0;
    this.cars_info[ a ].has_started = false;    //HERE
    }

var car = new Car( 100, 'one' );

this.cars.push( car );
}

Level.prototype.restart = function()
{

};

Level.prototype.new_life = function()
{
G.PLAYER.moveTo( this.start_x, this.start_y );
G.PLAYER.oneLessLife();
};


Level.prototype.clear = function()
{
for (var a = 0 ; a < this.cars.length ; a++)
    {
    this.cars[ a ].clear();
    }

this.cars.length = 0;
this.count_duration = 0;

this.road.clear();
};

Level.prototype.tick = function( event )
{
this.count_duration += event.delta / 1000;  // in seconds

var cars = this.cars;

for (var a = cars.length - 1 ; a >= 0 ; a--)
    {
    var clear = cars[ a ].tick();

    if ( clear )
        {
        cars.splice( a, 1 );
        }
    }

if ( this.checkCollisions() )
    {
    console.log( 'Collision has occurred.' );
    this.new_life();
    }
};



/*
    Check collisions between the player and a car
 */

Level.prototype.checkCollisions = function()
{
var player = G.PLAYER;
var cars = this.cars;

for (var a = 0 ; a < cars.length ; a++)
    {
    var car = cars[ a ];

    var collision = Utilities.boxBoxCollision(
        player.getX(),
        player.getY(),
        player.width,
        player.height,
        car.getX(),
        car.getY(),
        car.width,
        car.height );

    if ( collision )
        {
        return true;
        }
    }

return false;
};



window.Level = Level;

}(window));
