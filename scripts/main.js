var G = {
    CANVAS: null,
    STAGE: null,
    PRELOAD: null
};

var BASE_URL = '';

window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.CANVAS.width = 600;
G.CANVAS.height = 500;

G.STAGE = new createjs.Stage( G.CANVAS );

createjs.Ticker.setFPS( 60 );

GameMenu.init();
HighScore.init();
Keyboard.init();

var manifest = [
        { id: 'level_1', src: BASE_URL + 'levels/level1.json' },
        { id: 'level_2', src: BASE_URL + 'levels/level2.json' },
        { id: 'level_3', src: BASE_URL + 'levels/level3.json' },
        { id: 'level_4', src: BASE_URL + 'levels/level4.json' },
        { id: 'level_5', src: BASE_URL + 'levels/level5.json' }
    ];

G.PRELOAD = new createjs.LoadQueue();
G.PRELOAD.on( 'complete', Game.start );
G.PRELOAD.loadManifest( manifest, true );
};
