var G = {
    CANVAS: null,
    STAGE: null,
    PLAYER: null,
    ROAD: null
};


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.CANVAS.width = 600;
G.CANVAS.height = 400;

G.STAGE = new createjs.Stage( G.CANVAS );

G.ROAD = new Road( 0, 50, 300, 200 );
G.PLAYER = new Player( 40, 40 );


document.addEventListener( 'keydown', keyEvents, false );

createjs.Ticker.on( 'tick', tick );
};



function keyEvents( event )
{
G.PLAYER.keyEvents( event );
}



function tick()
{
G.STAGE.update();
}
