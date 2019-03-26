import * as GameMenu from './game_menu.js';
import * as Options from './options.js';
import * as HighScore from './high_score.js';
import * as Keyboard from './keyboard.js';
import Level from './level.js';
import Player from './player.js';
import { G } from './main.js';


var PLAYER: Player | null = null;
var LEVEL: Level | null = null;
var CURRENT_LEVEL = 1;

var MESSAGE: createjs.Text;
var MESSAGE_CONTAINER: createjs.Container;
var MESSAGE_TIMEOUT: Utilities.Timeout;

var MUSIC: createjs.AbstractSoundInstance;


export function start()
{
initMessage();
loadInitialLevel();

MUSIC = createjs.Sound.play( 'happy_tune', null, 0, 0, -1 );

if ( Options.getMusicState() === false )
    {
    MUSIC.stop();
    }

GameMenu.show();

createjs.Ticker.on( 'tick', tick as (event: Object) => void );
}


function initMessage()
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
}


export function restart()
{
clear();
loadInitialLevel();
}


function clear()
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
}


function loadInitialLevel()
{
PLAYER = new Player();
LEVEL = new Level( G.PRELOAD.getResult( 'level_1' ) );
PLAYER.bringToTop();

CURRENT_LEVEL = 1;

GameMenu.startGame();

showMessage( 'Level ' + CURRENT_LEVEL, 2000 );
}


/**
 * @param levelPosition - The level number to load. Otherwise it loads the next level.
 */
export function nextLevel( levelPosition: number )
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

    showMessage( 'Level ' + CURRENT_LEVEL, 2000 );
    }

else
    {
    var timer = GameMenu.getTimer();

    HighScore.add( timer.getTimeSeconds() );
    clear();
    showMessage( 'You Win! ' + timer.getTimeString(), 2000, function() { loadInitialLevel(); } );
    }
};



function tick( event: createjs.TickerEvent )
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


export function getPlayer()
{
return PLAYER;
}


export function getCurrentLevel()
{
return CURRENT_LEVEL;
}


export function showMessage( text: string, timeout: number, callback?: () => void )
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
        callback!();
        }

    }, timeout );
}


export function setMusicState( onOff: boolean )
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
}
