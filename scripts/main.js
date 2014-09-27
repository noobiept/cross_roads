var G = {
    CANVAS: null,
    STAGE: null,
    PLAYER: null,
    LEVEL: null
};


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.CANVAS.width = 600;
G.CANVAS.height = 400;

G.STAGE = new createjs.Stage( G.CANVAS );

G.PLAYER = new Player();
G.LEVEL = new Level();

document.addEventListener( 'keydown', keyEvents, false );

createjs.Ticker.on( 'tick', tick );
};


function keyEvents( event )
{
G.PLAYER.keyEvents( event );
}


function tick()
{
G.LEVEL.tick();

G.STAGE.update();
}
