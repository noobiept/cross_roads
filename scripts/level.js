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

    // counts the time since the level started (useful to know when to start adding the cars)
this.count_duration = 0;

    // has the info of the cars to be added (which lane, spawn interval, etc)
    // these still haven't started
this.cars_info = Utilities.deepClone( info.cars );

for (var a = 0 ; a < this.cars_info.length ; a++)
    {
    this.cars_info[ a ].count = 0;
    }

    // this will have the same info there is in .cars_info (it will be moved to here), once it is active (the level duration has passed the .start_seconds property)
this.active_cars_info = [];
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
var delta = event.delta / 1000;  // in seconds
this.count_duration += delta;

var a;
var info;

    // check if we need to activate any car info
for (a = this.cars_info.length - 1 ; a >= 0 ; a--)
    {
    info = this.cars_info[ a ];

    if ( this.count_duration >= info.start_seconds )
        {
        this.active_cars_info.push( info );
        this.cars_info.splice( a, 1 );
        }
    }

    // add new cars, according to its spawn interval
for (a = 0 ; a < this.active_cars_info.length ; a++)
    {
    info = this.active_cars_info[ a ];

    info.count += delta;

    if ( info.count >= info.spawn_interval_seconds )
        {
        var car = new Car( this.road.laneToY( info.lane ), info.type );

        this.cars.push( car );

        info.count = 0;
        }
    }


    // run the active cars logic (tick)
var cars = this.cars;

for (a = cars.length - 1 ; a >= 0 ; a--)
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
