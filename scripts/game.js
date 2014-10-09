(function(window)
{
function Game()
{

}

var PLAYER = null;
var LEVEL = null;
var CURRENT_LEVEL = 1;

Game.start = function()
{
Game.loadLevel( CURRENT_LEVEL );

document.addEventListener( 'keydown', keyEvents, false );

createjs.Ticker.on( 'tick', tick );
};


Game.restart = function()
{
Game.clear();
Game.loadLevel( CURRENT_LEVEL );
};


Game.clear = function()
{
if ( LEVEL )
    {
    LEVEL.clear();
    LEVEL = null;
    }

if ( PLAYER )
    {
    PLAYER.clear();
    PLAYER = null;
    }

CURRENT_LEVEL = 1;
};


Game.loadLevel = function( level )
{
PLAYER = new Player();
LEVEL = new Level( G.PRELOAD.getResult( 'level_' + level ) );

GameMenu.startGame();
};



Game.nextLevel = function()
{
LEVEL.clear();
LEVEL = null;

CURRENT_LEVEL++;

var next = 'level_' + CURRENT_LEVEL;

var levelInfo = G.PRELOAD.getResult( next );

if ( levelInfo !== null )
    {
    LEVEL = new Level( levelInfo );
    }

else
    {
    console.log( 'no more levels' );
    }
};


function keyEvents( event )
{
PLAYER.keyEvents( event );
}


function tick( event )
{
if ( LEVEL )
    {
    LEVEL.tick( event );
    }

G.STAGE.update();
}


Game.getPlayer = function()
{
return PLAYER;
};


Game.getCurrentLevel = function()
{
return CURRENT_LEVEL;
};


window.Game = Game;

}(window));