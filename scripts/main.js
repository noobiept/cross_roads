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
        { id: 'level_5', src: BASE_URL + 'levels/level5.json' },

        { id: 'car_1', src: BASE_URL + 'images/car1.png' },
        { id: 'car_2', src: BASE_URL + 'images/car2.png' },
        { id: 'car_3', src: BASE_URL + 'images/car3.png' },
        { id: 'car_4', src: BASE_URL + 'images/car4.png' },
        { id: 'car_5', src: BASE_URL + 'images/car5.png' },
        { id: 'car_6', src: BASE_URL + 'images/car6.png' },

        { id: 'happy_tune', src: BASE_URL + 'music/happy_tune.ogg' }
    ];

    // add a loading message
var loadingMessage = new createjs.Text( '', '30px monospace' );

loadingMessage.textAlign = 'center';
loadingMessage.x = G.CANVAS.width / 2;
loadingMessage.y = G.CANVAS.height / 2;

var tickFunction = createjs.Ticker.on( 'tick', function()
    {
    G.STAGE.update();
    });

G.STAGE.addChild( loadingMessage );


G.PRELOAD = new createjs.LoadQueue();
G.PRELOAD.installPlugin( createjs.Sound );
G.PRELOAD.on( 'progress', function( event )
    {
    loadingMessage.text = 'Loading.. ' + (event.progress * 100 | 0) + '%';
    });
G.PRELOAD.on( 'complete', function()
    {
    G.STAGE.removeChild( loadingMessage );
    createjs.Ticker.off( 'tick', tickFunction );

    Game.start();
    });
G.PRELOAD.loadManifest( manifest, true );
};
