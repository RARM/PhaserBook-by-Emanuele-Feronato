var game; // The game variable is outside of the window.onload scope os it is accessible to the resizeGame subroutine

var gameOptions = { // IT way better to have this information in one variable, and if we need to change them in the furute just change them here than using "search and replace"
  tileSize: 200, // Size of each tile in pixels
  tileSpacing: 20, // Space between two tiles, in pixels
  boardSize: { // Board size, amount of rows and cols
    rows: 4,
    cols: 4
},
tweenSpeed: 2000 // Tweens to animate tiles
}





window.onload = function() { // The onload event (for the windows) fires after all objects in the DOM hierarchy have finished loading
  var gameConfig = {
    /* gameConfig: contains some game settings such as width, height and background color
       We are also passing gameConfig as an argument into the Phaser.Game at the game variable */
    width: gameOptions.boardSize.cols * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
    height:  gameOptions.boardSize.rows * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
    backgroundColor: 0xECF0F1,
    scene: [bootGame, playGame]
    /* Phaser scenes take care of cleaning memory and resource management
    It is highly recommended to have at least another scene where to preload the resources
    The first scene in the array will be the one started at the beginning of the game */
  }


  game = new Phaser.Game(gameConfig); // Creating a new instance of a Phaser game

  window.focus(); // Sets focus to the current window, if you don't focus the current window, keyboard input may not word
  resizeGame(); // Adjust the game size the first time the page is loaded
  window.addEventListener("resize", resizeGame); // Adjust the game size every time the window is resized
}





// Game scenes
class bootGame extends Phaser.Scene {
  constructor() {
    super("BootGame");
  }

  preload() {
    this.load.image("emptytile", "assets/sprites/emptytile.png");
    /*
    load.image(key, url) loads an imagewants as arguments respectively the
    unique asset key of the image file and the URL of the image.
    */

    this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
        frameWidth: gameOptions.tileSize,
        frameHeight: gameOptions.tileSize
    });
    /*
    load.spritesheet(key, url, config) loads a sprite sheet and wants as
    arguments respectively the unique asset key of the file, the URL to load the
    texture file from and a configuration object with frameWidth value
    representing the frame width of each tile, in pixels, and frameHeight value
    representing the frame height of each tile, in pixels.
    */
  }

  create() {
    console.log("Game is booting...");
    this.scene.start("PlayGame");
    /*
    scene.start(key) starts the scene identified by the unique key name, which
    is the same name you declared in the constructor with super(key).
    */
  }
}



class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  create() {
    console.log("This is my awesome game");

    this.boardArray = []; // Creating a two dimensional array to store board information
    for(var i = 0; i < 4; i++) { // Rows
      this.boardArray[i] = [];
      for(var j = 0; j < 4; j++) { // Columns
        var tilePosition = this.getTilePosition(i, j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile"); // Adding 16 instances of the "emptytile" image
        /*
        add.image(x, y, key) places an image on the stage and wants as arguments
        the x coordinate of the image, in pixels, the y coordinate of the image, in
        pixels, and the key of the image used.
        */

        var tile = this.add.sprite(tilePosition.x, tilePosition.y, "tiles", 0);
        /*
        add.sprite(x, y, key, frame) places an image on the stage and wants as
        arguments the x coordinate of the image, in pixels, the y coordinate of the
        image, in pixels, the key of the image used and optionally the number of the
        frame to display, if a sprite sheet is used. Default value is zero.
        */
        tile.visible = false;
        /*
        visible property sets visible state of the sprite. Non-visible sprites are not
        rendered.
        */

        this.boardArray[i][j] = { // Object that store each tile information on the board
            tileValue: 0, // value assigned to the tile
            tileSprite: tile // this is the sprite so we can manipulate it later
        }
      }
    }

    this.addTile();
    this.addTile();
  }





  // Custom methods of the class below
  getTilePosition(row, col) {
    var posX = (col + 1) * gameOptions.tileSpacing + (col + 0.5) * gameOptions.tileSize;
    var posY = (row + 1) * gameOptions.tileSpacing + (row + 0.5) * gameOptions.tileSize;

    return new Phaser.Geom.Point(posX, posY);
    /*
    Geom.Point object represents a location in a two-dimensional coordinate
    system, where x represents the horizontal axis and y represents the vertical
    axis.

    To access the values, just use the x and y attributes:
    var example = new Phaser.Geom.Point(valueX, valueY);
    example.x == valueX; // true
    example.y == valueY // true
    */
  }



  addTile() {
      var emptyTiles = []; // It will store all empty tile we'll find

      for (var i = 0; i < gameOptions.boardSize.rows; i++) { // First, searching for emptyTiles
          for (var j = 0; j < gameOptions.boardSize.cols; j++) {
              if (this.boardArray[i][j].tileValue == 0) {
                  emptyTiles.push({
                      row: i,
                      col: j
                  })
              }
          }
      }

      if (emptyTiles.length > 0) { // Chosing one tile and making it visible
          var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
          /*
          Utils.Array.GetRandom(array) method returns a random element from
          array.
          */

          // Showing the tile and updating boardArray
          this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
          this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
          this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
          /*
          setFrame(n) method sets the frame the Game Object will use to render with.
          */

          this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;
          /*
          alpha property sets the alpha – or the transparency – of the sprite. alpha range
          goes from zero – completely transparent – to one – completely opaque.
          */
          this.tweens.add({
              targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
              alpha: 1,
              duration: gameOptions.tweenSpeed
          });
          /*
          "tweens.add(config)" method creates and executes a tween with the options
          stored in config object.

          "targets" is the array containing all targets affected by the tween.
          "alpha" is the destination alpha.
          "duration" is the duration of the tween in milliseconds.
          */
      }
  }
}





function resizeGame() { // resizeGame: adjust the game size to try to caver the wider screen area possible
  // Retriving some information about the window dimensions, and calculation the ratio of the window and the game
  var canvas = document.querySelector("canvas"); // querySelector method return the first element that matches the specified selector
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  // Ratio: relationship between two number: how many times the width can be contained into the height
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
//  console.log("Window ratio: " + windowWidth + " / " + windowHeight + " = " + windowRatio + "\nSo that " + windowWidth + " width ocupies " + windowRatio + " (ratio) of " + windowHeight + " height");

  // Adjusting the game size based on the calculations made above
  if (windowRatio < gameRatio) { // In case the window has more height than width: make the width equals and adjust the height of the game to keep the same ratio
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  } else { // In case
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}
