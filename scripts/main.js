var G = {
    CANVAS: null,
    STAGE: null,
    PRELOAD: null,
    PLAYER: null,
    LEVEL: null
};

var BASE_URL = '';

window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.CANVAS.width = 600;
G.CANVAS.height = 400;

G.STAGE = new createjs.Stage( G.CANVAS );

var manifest = [
        { id: 'level0', src: BASE_URL + 'levels/level0.json' }
    ];

G.PRELOAD = new createjs.LoadQueue();
G.PRELOAD.on( 'complete', startGame );
G.PRELOAD.loadManifest( manifest, true );
};


function startGame()
{
G.PLAYER = new Player();
G.LEVEL = new Level( G.PRELOAD.getResult( 'level0' ) );

document.addEventListener( 'keydown', keyEvents, false );

createjs.Ticker.on( 'tick', tick );
}


function keyEvents( event )
{
G.PLAYER.keyEvents( event );
}


function tick( event )
{
G.LEVEL.tick( event );

G.STAGE.update();
}
