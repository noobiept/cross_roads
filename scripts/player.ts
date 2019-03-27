import * as GameMenu from './game_menu.js';
import * as Keyboard from './keyboard.js';
import { getAsset, addToStage, getCanvasDimensions, removeFromStage } from './main.js';


export default class Player {

shape!: createjs.Bitmap;
width: number;
height: number;
movement_step: number;
movement_animation: number;
lives: number;


constructor()
{
this.width = 15;
this.height = 15;
this.movement_step = 11;
this.movement_animation = 100;  // ease duration
this.lives = 10;

this.setupShape();
}


setupShape()
{
const image = getAsset( 'player_1' );
const shape = new createjs.Bitmap( image );

this.shape = shape;
this.getNewRandomShape();

addToStage( shape );
}


getNewRandomShape()
{
var position = Utilities.getRandomInt( 1, 8 );
this.shape.image = getAsset( 'player_' + position ) as HTMLImageElement;
}


positionIn( x: number, y: number )
{
createjs.Tween.removeTweens( this.shape );

this.shape.x = x;
this.shape.y = y;
}


moveTo( xDirection: number, yDirection: number )
{
const canvas = getCanvasDimensions();
var angle = Math.atan2( yDirection, xDirection );

var nextX = this.shape.x + Math.cos( angle ) * this.movement_step;
var nextY = this.shape.y + Math.sin( angle ) * this.movement_step;

if ( nextX < 0 )
    {
    nextX = 0;
    }

else if ( nextX > canvas.width - this.width )
    {
    nextX = canvas.width - this.width;
    }

if ( nextY < 0 )
    {
    nextY = 0;
    }

else if ( nextY > canvas.height - this.height )
    {
    nextY = canvas.height - this.height;
    }

createjs.Tween.get( this.shape, { override: true } ).to({
        x: nextX, y: nextY
    }, this.movement_animation );
};



clear()
{
removeFromStage( this.shape );
}


getX()
{
return this.shape.x;
}


getY()
{
return this.shape.y;
}


oneLessLife()
{
this.lives--;

GameMenu.setLives( this.lives );

if ( this.lives <= 0 )
    {
    return false;
    }

return true;
}


tick( event: createjs.TickerEvent )
{
var keysHeld = Keyboard.KEYS_HELD;

if ( keysHeld.left && keysHeld.up )
    {
    this.moveTo( -1, -1 );
    }

else if ( keysHeld.left && keysHeld.down )
    {
    this.moveTo( -1, 1 );
    }

else if ( keysHeld.right && keysHeld.up )
    {
    this.moveTo( 1, -1 );
    }

else if ( keysHeld.right && keysHeld.down )
    {
    this.moveTo( 1, 1 );
    }

else if ( keysHeld.left )
    {
    this.moveTo( -1, 0 );
    }

else if ( keysHeld.right )
    {
    this.moveTo( 1, 0 );
    }

else if ( keysHeld.up )
    {
    this.moveTo( 0, -1 );
    }

else if ( keysHeld.down )
    {
    this.moveTo( 0, 1 );
    }
};


/**
 * Bring the player's shape to the top of other elements (z-index).
 */
bringToTop()
{
addToStage( this.shape );
}
}