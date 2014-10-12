(function(window)
{
function Game()
{

}

var PLAYER = null;
var LEVEL = null;
var CURRENT_LEVEL = 1;
var MESSAGE = null;
var MESSAGE_TIMEOUT = null;

Game.start = function()
{
Game.loadInitialLevel();

Game.initMessage();

createjs.Ticker.on( 'tick', tick );
};


Game.initMessage = function()
{
MESSAGE = new createjs.Text( '', '30px monospace' );
MESSAGE.visible = false;
MESSAGE.textAlign = 'center';

MESSAGE.x = G.CANVAS.width / 2;
MESSAGE.y = G.CANVAS.height / 2;

G.STAGE.addChild( MESSAGE );

MESSAGE_TIMEOUT = new Utilities.Timeout();
};


Game.restart = function()
{
Game.clear();
Game.loadInitialLevel();
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

Keyboard.clearKeysHeld();

CURRENT_LEVEL = 1;
};


Game.loadInitialLevel = function()
{
PLAYER = new Player();
LEVEL = new Level( G.PRELOAD.getResult( 'level_1' ) );

CURRENT_LEVEL = 1;

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
    GameMenu.setLevel( CURRENT_LEVEL );
    }

else
    {
    Game.clear();
    Game.showMessage( 'You Win!', 2000, function() { Game.loadInitialLevel(); } );
    }
};



function tick( event )
{
if ( LEVEL )
    {
    LEVEL.tick( event );
    }

if ( PLAYER )
    {
    PLAYER.tick( event );
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


Game.showMessage = function( text, timeout, callback )
{
MESSAGE.text = text;
MESSAGE.visible = true;

MESSAGE_TIMEOUT.start( function()
    {
    MESSAGE.visible = false;

    if ( _.isFunction( callback ) )
        {
        callback();
        }

    }, timeout );
};


window.Game = Game;

}(window));