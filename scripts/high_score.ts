
export type HighScoreData = number[];


var HIGH_SCORE: HighScoreData = [];
var SAVE_LIMIT = 5;     // how many scores to local storage
var LIST_ITEMS = [];

HighScore.init = function( scoreData )
{
var ul = document.querySelector( '#HighScore' );

    // add the list items that will have the high scores
for (var a = 0 ; a < SAVE_LIMIT ; a++)
    {
    var li = document.createElement( 'li' );

    li.className = 'value';
    ul.appendChild( li );

    LIST_ITEMS.push( li );
    }

if ( scoreData )
    {
    HIGH_SCORE = scoreData;
    }

HighScore.updateHtmlElement();
};


HighScore.add = function( value )
{
    // don't add repeated values
if ( HIGH_SCORE.indexOf( value ) >= 0 )
    {
    return;
    }

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
AppStorage.setData( { cross_roads_high_score: HIGH_SCORE } );
};


HighScore.clear = function()
{
HIGH_SCORE.length = 0;

HighScore.save();
};
