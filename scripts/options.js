(function(window)
{
function Options()
{

}

var OPTIONS = {
        music_state: true
    };


Options.load = function()
{
var options = Utilities.getObject( 'options' );

if ( options !== null )
    {
    if ( Utilities.isBoolean( options.music_state ) )
        {
        OPTIONS.music_state = options.music_state;
        }
    }
};


Options.save = function()
{
Utilities.saveObject( 'options', OPTIONS );
};


Options.setMusicState = function( state )
{
OPTIONS.music_state = state;

Options.save();
};


Options.getMusicState = function()
{
return OPTIONS.music_state;
};

window.Options = Options;

}(window));