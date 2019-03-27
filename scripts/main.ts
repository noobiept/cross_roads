import * as AppStorage from './app_storage.js';
import * as Options from './options.js';
import * as GameMenu from './game_menu.js';
import * as HighScore from './high_score.js';
import * as Keyboard from './keyboard.js';
import * as Game from './game.js';
import * as Music from './music.js';

let CANVAS: HTMLCanvasElement;
let STAGE: createjs.Stage;
let PRELOAD: createjs.LoadQueue;


window.onload = function()
{
AppStorage.getData( [ 'cross_roads_high_score', 'cross_roads_options', 'cross_roads_has_run_before' ], initApp );
};


function initApp( data: AppStorage.StorageData )
{
CANVAS = document.getElementById( 'MainCanvas' ) as HTMLCanvasElement;
CANVAS.width = 600;
CANVAS.height = 600;

STAGE = new createjs.Stage( CANVAS );

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Sound.alternateExtensions = [ 'mp3' ];

Options.load( data[ 'cross_roads_options' ] );
GameMenu.init();
HighScore.init( data[ 'cross_roads_high_score' ] );
Keyboard.init([ Music.play ]);

var manifest = [
        { id: 'level_1', src: 'levels/level1.json' },
        { id: 'level_2', src: 'levels/level2.json' },
        { id: 'level_3', src: 'levels/level3.json' },
        { id: 'level_4', src: 'levels/level4.json' },
        { id: 'level_5', src: 'levels/level5.json' },
        { id: 'level_6', src: 'levels/level6.json' },
        { id: 'level_7', src: 'levels/level7.json' },
        { id: 'level_8', src: 'levels/level8.json' },
        { id: 'level_9', src: 'levels/level9.json' },
        { id: 'level_10', src: 'levels/level10.json' },
        { id: 'level_11', src: 'levels/level11.json' },
        { id: 'level_12', src: 'levels/level12.json' },
        { id: 'level_13', src: 'levels/level13.json' },
        { id: 'level_14', src: 'levels/level14.json' },
        { id: 'level_15', src: 'levels/level15.json' },
        { id: 'level_16', src: 'levels/level16.json' },
        { id: 'level_17', src: 'levels/level17.json' },
        { id: 'level_18', src: 'levels/level18.json' },
        { id: 'level_19', src: 'levels/level19.json' },
        { id: 'level_20', src: 'levels/level20.json' },

        { id: 'car_1', src: 'images/car1.png' },
        { id: 'car_2', src: 'images/car2.png' },
        { id: 'car_3', src: 'images/car3.png' },
        { id: 'car_4', src: 'images/car4.png' },
        { id: 'car_5', src: 'images/car5.png' },
        { id: 'car_6', src: 'images/car6.png' },

        { id: 'happy_tune', src: 'music/happy_tune.ogg' },

        { id: 'player_1', src: 'images/player1.png' },
        { id: 'player_2', src: 'images/player2.png' },
        { id: 'player_3', src: 'images/player3.png' },
        { id: 'player_4', src: 'images/player4.png' },
        { id: 'player_5', src: 'images/player5.png' },
        { id: 'player_6', src: 'images/player6.png' },
        { id: 'player_7', src: 'images/player7.png' },
        { id: 'player_8', src: 'images/player8.png' }
    ];

    // add a loading message
var loadingMessage = new createjs.Text( '', '30px monospace' );

loadingMessage.textAlign = 'center';
loadingMessage.x = CANVAS.width / 2;
loadingMessage.y = CANVAS.height / 2;

createjs.Ticker.on( 'tick', mainTick as (event: Object) => void );

STAGE.addChild( loadingMessage );

PRELOAD = new createjs.LoadQueue();
PRELOAD.installPlugin( createjs.Sound );
PRELOAD.on( 'progress', function( event: createjs.ProgressEvent )
    {
    loadingMessage.text = 'Loading.. ' + (event.progress * 100 | 0) + '%';
    } as (event: Object) => void);
PRELOAD.on( 'complete', function()
    {
    STAGE.removeChild( loadingMessage );
    STAGE.update();

        // show the help page on the first run of the game
    if ( !data[ 'cross_roads_has_run_before' ] )
        {
        AppStorage.setData( { cross_roads_has_run_before: true } );

        var help = document.getElementById( 'Help' )!;
        help.className = 'show';

        var start = document.getElementById( 'HelpStartGame' )!;
        start.onclick = function()
            {
            help.className = '';
            Game.start();
            };
        }

    else
        {
        Game.start();
        }
    });
PRELOAD.loadManifest( manifest, true );
}


/**
 * Get the width/height of the canvas.
 */
export function getCanvasDimensions() {
    return {
        width: CANVAS.width,
        height: CANVAS.height
    };
}


/**
 * Add an element to the stage (to be shown on the canvas).
 */
export function addToStage( element: createjs.DisplayObject ) {
    STAGE.addChild( element );
}


/**
 * Remove an element from the stage.
 */
export function removeFromStage( element: createjs.DisplayObject ) {
    STAGE.removeChild( element );
}


/**
 * Get a previously pre-loaded asset (image, sound, map, etc).
 */
export function getAsset( id: string ) {
    return PRELOAD.getResult( id );
}


/**
 * The main game loop, calls other updates from here.
 */
function mainTick(event: createjs.TickerEvent) {
    Game.tick( event );
    STAGE.update();
}