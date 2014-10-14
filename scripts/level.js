(function(window)
{
function Level( info )
{
var startX = 200;
var startY = 0;
var player = Game.getPlayer();

player.positionIn( startX, startY );

this.start_x = info.player.startX;
this.start_y = info.player.startY;

player.positionIn( this.start_x, this.start_y );

this.cars = [];
this.road = new Road( info.road );

    // counts the time since the level started (useful to know when to start adding the cars)
this.count_duration = 0;

    // has the info of the cars to be added (which lane, spawn interval, etc)
    // these still haven't started
this.cars_info = Utilities.deepClone( info.cars );

for (var a = 0 ; a < this.cars_info.length ; a++)
    {
    this.cars_info[ a ].count = 0;

        // start the level already with some cars in the road
    var carInfo = this.cars_info[ a ];
    var carTypeInfo = Car.TYPES[ carInfo.type ];
    var xStep = carTypeInfo.speed * carInfo.spawn_interval_seconds;

        // starting 'x'
    var x = carTypeInfo.speed * (carInfo.spawn_interval_seconds - carInfo.start_seconds);

    while( x < G.CANVAS.width )
        {
        var car = new Car({
                x: x,
                y: this.road.laneToY( carInfo.lane ),
                type: carInfo.type,
                level: this
            });

        this.cars.push( car );

        x += xStep;
        }
    }

    // this will have the same info there is in .cars_info (it will be moved to here), once it is active (the level duration has passed the .start_seconds property)
this.active_cars_info = [];

    // need to move here to pass the level
this.destination_y = info.road.y + info.road.lanes * Road.getLaneHeight() + 10;

this.player = player;
}


Level.prototype.newLife = function()
{
this.player.positionIn( this.start_x, this.start_y );

return this.player.oneLessLife();
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

        var car = new Car({
            y: this.road.laneToY( info.lane ),
            type: info.type,
            level: this
        });

        this.cars.push( car );
        }
    }

    // add new cars, according to its spawn interval
for (a = 0 ; a < this.active_cars_info.length ; a++)
    {
    info = this.active_cars_info[ a ];

    info.count += delta;

    if ( info.count >= info.spawn_interval_seconds )
        {
        var car = new Car({
            y: this.road.laneToY( info.lane ),
            type: info.type,
            level: this
        });

        this.cars.push( car );

        info.count = 0;
        }
    }


if ( this.checkCollisions() )
    {
    Game.showMessage( 'Collision!', 500 );

        // no more new lives
    if ( !this.newLife() )
        {
        Game.clear();
        Game.showMessage( 'No more lives, you loose!', 2000, function()
            {
            Game.loadInitialLevel();
            });
        return;
        }
    }


if ( this.player.getY() > this.destination_y )
    {
    Game.nextLevel();
    }
};



/*
    Check collisions between the player and a car
 */

Level.prototype.checkCollisions = function()
{
var player = this.player;
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


Level.prototype.removeCar = function( car )
{
var index = this.cars.indexOf( car );

this.cars.splice( index, 1 );

car.clear();
};


window.Level = Level;

}(window));
