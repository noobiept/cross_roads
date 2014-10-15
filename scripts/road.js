(function(window)
{
/*
    info = {
        lanes      : Number,
        side_walks : Number[]
    }
 */

function Road( info )
{
this.lines = [];        // array of createjs.Shape()
this.container = null;
this.lanes = info.lanes;
this.side_walks = info.side_walks;
this.width = G.CANVAS.width;
this.height = this.lanes * LANE_HEIGHT;

this.setupShape();
this.positionIn( 0, G.CANVAS.height / 2 - this.height / 2 );
}

    // height of each lane, as well of the side walks
var LANE_HEIGHT = 30;


Road.prototype.setupShape = function()
{
var container = new createjs.Container();

var g;
var linesColor = 'black';
var sideWalkColor = 'gray';
var lineHeight = 1;
var width = G.CANVAS.width;


    // :: Side walks :: //

for (var a = 0 ; a < this.side_walks.length ; a++)
    {
    var sideWalk = new createjs.Shape();

    g = sideWalk.graphics;

    g.beginFill( sideWalkColor );
    g.drawRect( 0, (this.side_walks[ a ]) * LANE_HEIGHT, width, LANE_HEIGHT );
    g.endFill();

    container.addChild( sideWalk );
    this.lines.push( sideWalk );
    }


    // :: Lane separators :: //

    // a lane is where the car will move
    // between each lane, there is a middle line separating the lanes
var middleLineLength = 20;
var lengthBetweenLines = middleLineLength / 2;


for (var a = 0 ; a < this.lanes ; a++)
    {
        // see if the next lane is not a sidewalk
        // that means we need to add a middle line
    if ( this.side_walks.indexOf( a ) < 0 &&
         this.side_walks.indexOf( a + 1 ) < 0 )
        {
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

            g.beginFill( linesColor );
            g.drawRect( midLength, LANE_HEIGHT + a * LANE_HEIGHT, length, lineHeight );
            g.endFill();

            container.addChild( shape );
            this.lines.push( shape );

            midLength += length + lengthBetweenLines;
            }
        }
    }


    // :: Container :: //
G.STAGE.addChild( container );

this.container = container;
};

Road.prototype.positionIn = function( x, y )
{
this.container.x = x;
this.container.y = y;
};

Road.prototype.clear = function()
{
G.STAGE.removeChild( this.container );
this.lines.length = 0;
};


Road.prototype.laneToY = function( lane )
{
return this.getY() + lane * LANE_HEIGHT + LANE_HEIGHT / 2;
};


Road.getLaneHeight = function()
{
return LANE_HEIGHT;
};

Road.prototype.getX = function()
{
return this.container.x;
};

Road.prototype.getY = function()
{
return this.container.y;
};


window.Road = Road;

}(window));
