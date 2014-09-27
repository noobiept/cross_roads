(function(window)
{
function Road( x, y, width, height )
{
this.lines = [];        // array of createjs.Shape()
this.container = null;
this.width = width;
this.height = height;

this.setupShape();
this.moveTo( x, y );
}

Road.prototype.setupShape = function()
{
var container = new createjs.Container();
var topLine = new createjs.Shape();
var bottomLine = new createjs.Shape();

var g;
var color = 'black';
var width = this.width;
var height = this.height;
var lineHeight = 1;

    // :: Top Line :: //
g = topLine.graphics;

g.beginFill( color );
g.drawRect( 0, 0, width, lineHeight );
g.endFill();

container.addChild( topLine );
this.lines.push( topLine );

    // :: Bottom Line :: //
g = bottomLine.graphics;

g.beginFill( color );
g.drawRect( 0, height, width, lineHeight );
g.endFill();

container.addChild( bottomLine );
this.lines.push( bottomLine );

    // :: Middle lines :: //
var middleLineLength = 20;
var lengthBetweenLines = middleLineLength / 2;

var midLength = 0;
var length;

while ( midLength < width )
    {
    if ( midLength + middleLineLength < width )
        {
        length = middleLineLength;
        }

    else
        {
        length = width - midLength;
        }

    var shape = new createjs.Shape();

    g = shape.graphics;

    g.beginFill( color );
    g.drawRect( midLength, height / 2, length, 1 );
    g.endFill();

    container.addChild( shape );
    this.lines.push( shape );

    midLength += length + lengthBetweenLines;
    }


    // :: Container :: //
G.STAGE.addChild( container );

this.container = container;
};

Road.prototype.moveTo = function( x, y )
{
this.container.x = x;
this.container.y = y;
};

Road.prototype.clear = function()
{
G.STAGE.removeChild( this.container );
this.lines.length = 0;
};


window.Road = Road;

}(window));
