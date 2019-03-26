/*global Options, Game, Utilities*/

(function(window)
{
function GameMenu()
{

}

var LIVES_ELEMENT = null;
var LEVEL_ELEMENT = null;

var TIMER = null;


GameMenu.init = function()
{
var container = document.querySelector( '#Menu' );

    // play/stop the music
var musicElement = container.querySelector( '#MusicState' );
var musicElementInfo = musicElement.querySelector( 'span' );

var booleanToStr = function( boolValue )
    {
    if ( boolValue === true )
        {
        return 'On';
        }

    return 'Off';
    };

var isPlaying = Options.getMusicState();

musicElementInfo.innerHTML = booleanToStr( isPlaying );


musicElement.onclick = function()
    {
    isPlaying = !isPlaying;

    musicElementInfo.innerHTML = booleanToStr( isPlaying );

    Game.setMusicState( isPlaying );
    };

    // restart the game
var restart = container.querySelector( '#Restart' );
restart.onclick = function()
    {
    Game.restart();
    };

    // donate button
var donate = container.querySelector( '#Donate' );
donate.onclick = function()
    {
    window.open( 'http://nbpt.eu/donate/', '_blank' );
    };

    // lives count
LIVES_ELEMENT = container.querySelector( '#Lives span' );

    // current level
LEVEL_ELEMENT = container.querySelector( '#Level span' );

    // timer
var timerElement = container.querySelector( '#Timer span' );

TIMER = new Utilities.Timer( timerElement );
};



GameMenu.setLives = function( lives )
{
LIVES_ELEMENT.innerHTML = lives;
};


GameMenu.setLevel = function( level )
{
LEVEL_ELEMENT.innerHTML = level;
};

GameMenu.startGame = function()
{
TIMER.restart();
GameMenu.setLevel( Game.getCurrentLevel() );
GameMenu.setLives( Game.getPlayer().lives );
};

GameMenu.getTimer = function()
{
return TIMER;
};


GameMenu.show = function()
{
var menu = document.querySelector( '#Menu' );

menu.style.display = 'block';
};


GameMenu.hide = function()
{
var menu = document.querySelector( '#Menu' );

menu.style.display = 'none';
};


window.GameMenu = GameMenu;

}(window));
