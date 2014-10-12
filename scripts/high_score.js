(function(window)
{
function HighScore()
{

}

var HIGH_SCORE = [];
var SAVE_LIMIT = 5;     // how many scores to local storage
var LIST_ITEMS = [];

HighScore.init = function()
{
var ul = document.querySelector( '#HighScore' );

    // add the list items that will have the high scores
for (var a = 0 ; a < SAVE_LIMIT ; a++)
    {
    var li = document.createElement( 'li' );

    ul.appendChild( li );

    LIST_ITEMS.push( li );
    }

HighScore.load();
HighScore.updateHtmlElement();
};


HighScore.add = function( value )
{
HIGH_SCORE.push( value );

    // the lower the value (which represents the time it took to finish the game) the better
HIGH_SCORE.sort( function( a, b )
    {
    return a - b;
    });

    // if we have more elements than the limit, remove the worse (higher) value
if ( HIGH_SCORE.length > SAVE_LIMIT )
    {
    HIGH_SCORE.pop();
    }

HighScore.save();
HighScore.updateHtmlElement();
};


/*
    Update the html element, with the current high-scores
 */

HighScore.updateHtmlElement = function()
{
for (var a = 0 ; a < SAVE_LIMIT ; a++)
    {
    var value = HIGH_SCORE[ a ];
    var li = LIST_ITEMS[ a ];

    if ( typeof value === 'undefined' )
        {
        li.innerHTML = '-';
        }

    else
        {
        li.innerHTML = Utilities.timeToString( value * 1000 );
        }
    }
};



HighScore.save = function()
{
Utilities.saveObject( 'high_score', HIGH_SCORE );
};


HighScore.load = function()
{
var scoreObj = Utilities.getObject( 'high_score' );

if ( scoreObj !== null )
    {
    HIGH_SCORE = scoreObj;
    }
};


window.HighScore = HighScore;

})(window);