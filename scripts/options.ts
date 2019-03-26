/*global Utilities, AppStorage*/

(function(window)
{
function Options()
{

}

var OPTIONS = {
        music_state: true
    };


Options.load = function( optionsData )
{
if ( optionsData )
    {
    if ( Utilities.isBoolean( optionsData.music_state ) )
        {
        OPTIONS.music_state = optionsData.music_state;
        }
    }
};


Options.save = function()
{
AppStorage.setData( { cross_roads_options: OPTIONS } );
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
