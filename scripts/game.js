(function(window)
{
function Game()
{

}

var PLAYER = null;
var LEVEL = null;
var CURRENT_LEVEL = 1;

var MESSAGE = null;
var MESSAGE_CONTAINER = null;
var MESSAGE_TIMEOUT = null;

var MUSIC = null;

Game.start = function()
{
Game.initMessage();
Game.loadInitialLevel();

MUSIC = createjs.Sound.play( 'happy_tune', null, 0, 0, -1 );

if ( Options.getMusicState() === false )
    {
    MUSIC.stop();
    }

GameMenu.show();

createjs.Ticker.on( 'tick', tick );
};


Game.initMessage = function()
{
var canvasWidth = G.CANVAS.width;

    // the text part
MESSAGE = new createjs.Text( '', '30px monospace' );
MESSAGE.textAlign = 'center';

    // the background color
var background = new createjs.Shape();
var backgroundHeight = 40;

var g = background.graphics;

g.beginFill( 'lightblue' );
g.drawRect( -canvasWidth / 2, 0, G.CANVAS.width, backgroundHeight );
g.endFill();

    // the container
MESSAGE_CONTAINER = new createjs.Container();

MESSAGE_CONTAINER.visible = false;
MESSAGE_CONTAINER.addChild( background );
MESSAGE_CONTAINER.addChild( MESSAGE );

MESSAGE_CONTAINER.x = G.CANVAS.width / 2;
MESSAGE_CONTAINER.y = 0;

G.STAGE.addChild( MESSAGE_CONTAINER );

    // the timeout that will clear the message
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
PLAYER.bringToTop();

CURRENT_LEVEL = 1;

GameMenu.startGame();

Game.showMessage( 'Level ' + CURRENT_LEVEL, 2000 );
};


/**
    @param {Number} [levelPosition] - The level number to load. Otherwise it loads the next level.
 */

Game.nextLevel = function( levelPosition )
{
LEVEL.clear();
LEVEL = null;

if ( typeof levelPosition === 'undefined' )
    {
    CURRENT_LEVEL++;
    }

else
    {
    CURRENT_LEVEL = levelPosition;
    }


var next = 'level_' + CURRENT_LEVEL;

var levelInfo = G.PRELOAD.getResult( next );

if ( levelInfo !== null )
    {
    LEVEL = new Level( levelInfo );
    GameMenu.setLevel( CURRENT_LEVEL );

    PLAYER.getNewRandomShape();
    PLAYER.bringToTop();

    Game.showMessage( 'Level ' + CURRENT_LEVEL, 2000 );
    }

else
    {
    var timer = GameMenu.getTimer();

    HighScore.add( timer.getTimeSeconds() );
    Game.clear();
    Game.showMessage( 'You Win! ' + timer.getTimeString(), 2000, function() { Game.loadInitialLevel(); } );
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
MESSAGE_CONTAINER.visible = true;

    // re-add the element so that it stays on top of other elements (z-index)
G.STAGE.addChild( MESSAGE_CONTAINER );

MESSAGE_TIMEOUT.start( function()
    {
    MESSAGE_CONTAINER.visible = false;

    if ( Utilities.isFunction( callback ) )
        {
        callback();
        }

    }, timeout );
};


Game.setMusicState = function( onOff )
{
if ( onOff === true )
    {
    MUSIC.play();
    }

else
    {
    MUSIC.stop();
    }

Options.setMusicState( onOff );
};


window.Game = Game;

}(window));