var G = {
    CANVAS: null,
    STAGE: null,
    PLAYER: null,
    ROAD: null,
    CARS: []
};


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.CANVAS.width = 600;
G.CANVAS.height = 400;

G.STAGE = new createjs.Stage( G.CANVAS );

G.ROAD = new Road( 0, 50, 300, 200, 5 );
G.PLAYER = new Player( 40, 40 );

var car = new Car( 100, 'one' );

G.CARS.push( car );

document.addEventListener( 'keydown', keyEvents, false );

createjs.Ticker.on( 'tick', tick );
};



function keyEvents( event )
{
G.PLAYER.keyEvents( event );
}



function tick()
{
for (var a = G.CARS.length - 1 ; a >= 0 ; a--)
    {
    var clear = G.CARS[ a ].tick();

    if ( clear )
        {
        G.CARS.splice( a, 1 );
        }
    }

G.STAGE.update();
}
