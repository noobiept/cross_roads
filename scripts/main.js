var G = {
    CANVAS: null,
    STAGE: null,
    PRELOAD: null
};


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.CANVAS.width = 600;
G.CANVAS.height = 600;

G.STAGE = new createjs.Stage( G.CANVAS );

createjs.Ticker.setFPS( 60 );
createjs.Sound.alternateExtensions = [ 'mp3' ];

Options.load();
GameMenu.init();
HighScore.init();
Keyboard.init();

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

