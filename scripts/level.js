(function(window)
{
function Level()
{
var startX = 200;
var startY = 0;

G.PLAYER.moveTo( startX, startY );

this.start_x = startX;
this.start_y = startY;
this.cars = [];
this.road = new Road( 0, 50, 300, 200, 5 );


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

this.road.clear();
};

Level.prototype.tick = function()
{
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
