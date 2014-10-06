var G = {
    CANVAS: null,
    STAGE: null,
    PRELOAD: null,
    PLAYER: null,
    LEVEL: null,
    CURRENT_LEVEL: 0
};

var BASE_URL = '';

window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.CANVAS.width = 600;
G.CANVAS.height = 400;

G.STAGE = new createjs.Stage( G.CANVAS );

var manifest = [
        { id: 'level_0', src: BASE_URL + 'levels/level0.json' }
    ];

G.PRELOAD = new createjs.LoadQueue();
G.PRELOAD.on( 'complete', startGame );
G.PRELOAD.loadManifest( manifest, true );
};


function startGame()
{
G.PLAYER = new Player();
G.LEVEL = new Level( G.PRELOAD.getResult( 'level_0' ) );

document.addEventListener( 'keydown', keyEvents, false );

createjs.Ticker.on( 'tick', tick );
}


function nextLevel()
{
G.LEVEL.clear();
G.LEVEL = null;

G.CURRENT_LEVEL++;

var next = 'level_' + G.CURRENT_LEVEL;

var levelInfo = G.PRELOAD.getResult( next );

if ( levelInfo !== null )
    {
    G.LEVEL = new Level( levelInfo );
    }

else
    {
    console.log( 'no more levels' );
    }
}


function keyEvents( event )
{
G.PLAYER.keyEvents( event );
}


function tick( event )
{
if ( G.LEVEL )
    {
    G.LEVEL.tick( event );
    }


G.STAGE.update();
}
