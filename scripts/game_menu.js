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
var container = document.querySelector( '#GameMenu' );

LIVES_ELEMENT = container.querySelector( '#Lives span' );
LEVEL_ELEMENT = container.querySelector( '#Level span' );
var timerElement = container.querySelector( '#Timer span' );



var restart = container.querySelector( '#Restart' );

restart.onclick = function()
    {
        //HERE
    };

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
TIMER.start();
GameMenu.setLevel( G.CURRENT_LEVEL );
GameMenu.setLives( G.PLAYER.lives );
};


window.GameMenu = GameMenu;

}(window));