(function(window)
{
function Keyboard()
{

}

    // keys state (being pressed or not)
var KEYS_HELD = {
    up: false,
    down: false,
    left: false,
    right: false
};


Keyboard.init = function()
{
window.addEventListener( 'keydown', handleKeyDown, false );
window.addEventListener( 'keyup', handleKeyUp, false );
};


Keyboard.clearKeysHeld = function()
{
KEYS_HELD.up = false;
KEYS_HELD.down = false;
KEYS_HELD.left = false;
KEYS_HELD.right = false;
};


function handleKeyDown( event )
{
switch( event.keyCode )
    {
    case Utilities.KEY_CODE.a:
    case Utilities.KEY_CODE.leftArrow:

        KEYS_HELD.left = true;
        break;

    case Utilities.KEY_CODE.d:
    case Utilities.KEY_CODE.rightArrow:

        KEYS_HELD.right = true;
        break;

    case Utilities.KEY_CODE.w:
    case Utilities.KEY_CODE.upArrow:

        KEYS_HELD.up = true;
        break;

    case Utilities.KEY_CODE.s:
    case Utilities.KEY_CODE.downArrow:

        KEYS_HELD.down = true;
        break;
    }
}


function handleKeyUp( event )
{
switch( event.keyCode )
    {
    case Utilities.KEY_CODE.a:
    case Utilities.KEY_CODE.leftArrow:

        KEYS_HELD.left = false;
        break;

    case Utilities.KEY_CODE.d:
    case Utilities.KEY_CODE.rightArrow:

        KEYS_HELD.right = false;
        break;

    case Utilities.KEY_CODE.w:
    case Utilities.KEY_CODE.upArrow:

        KEYS_HELD.up = false;
        break;

    case Utilities.KEY_CODE.s:
    case Utilities.KEY_CODE.downArrow:

        KEYS_HELD.down = false;
        break;
    }
}


Keyboard.KEYS_HELD = KEYS_HELD;


window.Keyboard = Keyboard;

}(window));