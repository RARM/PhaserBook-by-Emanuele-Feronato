var game; // The game variable is outside of the window.onload scope os it is accessible to the resizeGame subroutine

var gameOptions = { // IT way better to have this information in one variable, and if we need to change them in the furute just change them here than using "search and replace"
  tileSize: 200, // Size of each tile in pixels
  tileSpacing: 20, // Space between two tiles, in pixels
  boardSize: { // Board size, amount of rows and cols
    rows: 4,
    cols: 4
  },
  tweenSpeed: 50, // Tweens to animate tiles
  // Below the conditions to consider a swipe
  swipeMaxTime: 1000, // miliseconds
  swipeMinDistance: 20, // pixels
  swipeMinNormal: 0.85, // maximum value of the component (in x and y) of the normalized swipe vector in pixels
  aspectRatio: 16/9 // it stores the aspect ratio of the game
}

// Game constants for processing user input
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;





window.onload = function() { // The onload event (for the windows) fires after all objects in the DOM hierarchy have finished loading
  // This variables allow are for readability, and so it is easy to implement the aspectRatio attribute of the gameOptions object
  var tileAndSpacing = gameOptions.tileSize + gameOptions.tileSpacing;
  var width = gameOptions.boardSize.cols * tileAndSpacing;
  width += gameOptions.tileSpacing;

  var gameConfig = {
    /* gameConfig: contains some game settings such as width, height and background color
       We are also passing gameConfig as an argument into the Phaser.Game at the game variable */
    width: width,
    height:  width * gameOptions.aspectRatio,
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
    this.load.image("restart", "assets/sprites/restart.png");
    this.load.image("scorepanel", "assets/sprites/scorepanel.png");
    this.load.image("scorelabels", "assets/sprites/scorelabels.png");
    this.load.image("logo", "assets/sprites/logo.png");
    this.load.image("howtoplay", "assets/sprites/howtoplay.png");
    this.load.image("gametitle", "assets/sprites/gametitle.png");
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

    this.load.audio("move", ["assets/sounds/move.ogg", "assets/sounds/move.mp3"]);
    this.load.audio("grow", ["assets/sounds/grow.ogg", "assets/sounds/grow.mp3"]);
    /*
    load.audio(key, audioFiles) handles sound preloading. The first argument
    is the key, the unique name assigned to the sound, the second is an array of
    files to be loaded, in different formats.
    */

    this.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
    /*
    load.bitmapFont(key, texturePath, xmlPath) method adds new bitmap
    font loading request, giving it unique key name and looking for texturePath
    image file and xmlPath data file.
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
    var restartXY = this.getTilePosition(-0.8, gameOptions.boardSize.cols - 1);
    var restartButton = this.add.sprite(restartXY.x, restartXY.y, "restart");
    restartButton.setInteractive();
    /*
    setInteractive() method enables the game object for input.
    */
    restartButton.on("pointerdown", function() {
      this.scene.start("PlayGame");
    }, this);

    var scoreXY = this.getTilePosition(-0.8, 1);
    this.add.image(scoreXY.x, scoreXY.y, "scorepanel");
    this.add.image(scoreXY.x, scoreXY.y - 70, "scorelabels");
    var textXY = this.getTilePosition(-0.92, -0.4);
    this.scoreText = this.add.bitmapText(textXY.x, textXY.y, "font", "0");
    /*
    add.bitmapText(x, y, key, text) method adds text string written with
    key bitmap text at coordinates x, y.
    */
    textXY = this.getTilePosition(-0.92, 1.1);
    this.bestScoreText = this.add.bitmapText(textXY.x, textXY.y, "font", "0");

    var gameTitle = this.add.image(10, 5, "gametitle");
    gameTitle.setOrigin(0, 0);
    /*
    The anchor or origin of an image or sprite sets the origin point of the image.
    When you add an image at x, y you actually add an image in a position so that
    its origin is x, y.
    Setting the origin to 0.5, 0.5 – which is also the default value – means the
    image origin is the center of the image.
    Setting the origin to 1, 1 means the image origin is on the bottom right corner.
    Setting the origin to 0, 0 means the image origin is on the top left corner.
    Any value from 0 to 1 is accepted.
    setOrigin(x, y) method sets image origin to x, y.
    */
    var howTo = this.add.image(game.config.width, 5, "howtoplay");
    howTo.setOrigin(1, 0);

    var logo = this.add.sprite(game.config.width / 2, game.config.height, "logo");
    logo.setOrigin(0.5, 1);
    logo.setInteractive();
    logo.on("pointerdown", function() {
      window.location.href = "http://www.emanueleferonato.com/"
      /*
      The window.location object can be used to redirect the browser to a new
      page.
      window.location.href = URL sets the href value to point to another web site
      located at URL.
      */
    });


    this.canMove = false; // We will use this attribute to know when the user can move the tiles

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
            tileSprite: tile, // this is the sprite so we can manipulate it later
            upgraded: false
        }
      }
    }

    this.addTile();
    this.addTile();

    // Waiting for player input
    this.input.keyboard.on("keydown", this.handleKey, this);
    this.input.on("pointerup", this.handleSwipe, this);
    /*
    input.keyboard.on(“keydown”, callback, context) executes callback
    function in context scope when a keyboard key is pressed.
    input.on(“pointerup”, callback, context) executes callback function
    in context scope when a pointer – mouse pointer or finger – is released.
    */


    // Sounds preloaded below
    this.moveSound = this.sound.add("move");
    this.growSound = this.sound.add("grow");
    /*
    sound.add(key) adds a new audio file to the sound manager. key is the
    unique name we gave to the sound.
    */
  }





  // Custom methods of the class below
  getTilePosition(row, col) {
    var posX = (col + 1) * gameOptions.tileSpacing + (col + 0.5) * gameOptions.tileSize;
    var posY = (row + 1) * gameOptions.tileSpacing + (row + 0.5) * gameOptions.tileSize;

    var boardHeight = gameOptions.boardSize.rows * gameOptions.tileSize;
    boardHeight += (gameOptions.boardSize.rows + 1) * gameOptions.tileSpacing;
    var offsetY = (game.config.height - boardHeight) / 2;
    posY += offsetY;

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
              duration: gameOptions.tweenSpeed,
              callbackScope: this,
              onComplete: function() {
                  console.log("Tween completed");
                  this.canMove = true;
              }
          });
          /*
          "tweens.add(config)" method creates and executes a tween with the options
          stored in config object.

          "targets" is the array containing all targets affected by the tween.
          "alpha" is the destination alpha.
          "duration" is the duration of the tween in milliseconds.
          "onComplete" function is executed once the tween is completed.
          "callbackScope" sets the scope of onComplete callback function.
          */
      }
  }





  // User input methods
  handleKey(e) { // Callback function. The event is the argument
//      var keyPressed = e.code;
      /*
      code property of a keyboard event returns the code of the key which fired the
      event.
      */
//      console.log("You pressed key #" + keyPressed);


      if(this.canMove) { // Check if player can move when receiving input
          switch (e.code) {
              case "KeyA":
              case "ArrowLeft":
                  this.makeMove(LEFT);  // Using constants make code more readable
                  break;
              case "KeyD":
              case "ArrowRight":
                  this.makeMove(RIGHT);
                  break;
              case "KeyW":
              case "ArrowUp":
                  this.makeMove(UP);
                  break;
              case "KeyS":
              case "ArrowDown":
                  this.makeMove(DOWN);
                  break;
          }
      }
  }



  handleSwipe(e) {
    // First, check if the user is allowed to move
    if (this.canMove) {
      var swipeTime = e.upTime - e.downTime;
      var fastEnough = swipeTime < gameOptions.swipeMaxTime;
      var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY); // The distance traveled by the swipe... the pixels will be always working with game size using Phaser input
      /*
      downTime property of pointerup event returns the timestamp taken when the
      input started, in milliseconds.

      upTime property of pointerup event returns the timestamp taken when the
      input ended, in milliseconds.

      downX and downY properties of pointerup event return respectively the
      horizontal and vertical coordinates where the input started, in pixels.

      upX and upY properties of pointerup event return respectively the horizontal
      and vertical coordinates where the input ended, in pixels.
      */

      var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
      /*
      GetMagnitude(point) method of Phaser.Geom.Point class returns the
      magnitude of point, in pixels.
      */
      var longEnough = swipeMagnitude > gameOptions.swipeMinDistance;

      // If the user can move, now check if the swipe is a valid swipe according to the gameOptions variables
      if (longEnough && fastEnough) {
        Phaser.Geom.Point.SetMagnitude(swipe, 1);
        /*
        SetMagnitude(point, magnitude) method of Phaser.Geom.Point class
        sets the magnitude of point to magnitude value. A value of 1 in magnitude
        normalizes point.
        */

        if (swipe.x > gameOptions.swipeMinNormal) {
          this.makeMove(RIGHT);
        }

        if (swipe.x < -gameOptions.swipeMinNormal) {
          this.makeMove(LEFT);
        }

        if (swipe.y > gameOptions.swipeMinNormal) {
          this.makeMove(DOWN);
        }

        if (swipe.y < -gameOptions.swipeMinNormal) {
          this.makeMove(UP);
        }
      }
    }

    /*
    console.log("Movement time: " + swipeTime + " ms");
    console.log("Horizontal distance: " + swipe.x + " pixels");
    console.log("Vertical distance: " + swipe.y + " pixels");
    */

  }



  makeMove(d) {
//      console.log("About to move");

    this.movingTiles = 0; // This variable keeps the count of tiles moved

    var dRow = (d == LEFT || d == RIGHT) ? 0 : d == UP ? -1 : 1;
    var dCol = (d == UP || d == DOWN) ? 0 : d == LEFT ? -1 : 1;
    this.canMove = false;

    var firstRow = (d == UP) ? 1 : 0;
    var lastRow = gameOptions.boardSize.rows - ((d == DOWN) ? 1 : 0);
    var firstCol = (d == LEFT) ? 1 : 0;
    var lastCol = gameOptions.boardSize.cols - ((d == RIGHT) ? 1 : 0);

    for (var i = firstRow; i < lastRow; i++) {
      for (var j = firstCol; j < lastCol; j++) {
        var curRow = dRow == 1 ? (lastRow - 1) - i : i;
        var curCol = dCol == 1 ? (lastCol - 1) - j : j;

        var tileValue = this.boardArray[curRow][curCol].tileValue;
        if (tileValue != 0) {
          var newRow = curRow;
          var newCol = curCol;
          while (this.isLegalPosition(newRow + dRow, newCol + dCol, tileValue)) {
            newRow += dRow;;
            newCol += dCol;
          }


          if (newRow != curRow || newCol != curCol) {
            // this.boardArray[curRow][curCol].tileSprite.depth = movedTiles;
            /*
            depth property of a game object sets its depth within the Scene, allowing to
            change the rendering order.
            It starts from zero and a game object with a higher depth value will always
            render in front of one with a lower value.
            */

            var newPos = this.getTilePosition(newRow, newCol);
            var willUpdate = this.boardArray[newRow][newCol].tileValue == tileValue;
            this.moveTile(this.boardArray[curRow][curCol].tileSprite, newPos, willUpdate);
            /*
            moveTile method will handle tile animation and movement, and has two
            arguments: the sprite to move and the Point object with the new position of the
            sprite.
            */

            // Merging tiles
            this.boardArray[curRow][curCol].tileValue = 0;
            if (willUpdate) { // In case they have the same number, they merge
              this.boardArray[newRow][newCol].tileValue++;
              this.boardArray[newRow][newCol].upgraded = true;
            } else { // Run code below if they are not supposed to merge
              this.boardArray[newRow][newCol].tileValue = tileValue;
            }
          }
        }
      }
    }

    if (this.movingTiles == 0) {
      this.canMove = true;
    } else {
      this.moveSound.play(); // play() method plays a sound.
    }
  }



  isLegalPosition(row, col, value) {
    var rowInside = row >= 0 && row < gameOptions.boardSize.rows;
    var colInside = col >= 0 && col < gameOptions.boardSize.cols;

    if (!rowInside  || !colInside) {
      return false;
    }

    var emptySpot = this.boardArray[row][col].tileValue == 0;
    var sameValue = this.boardArray[row][col].tileValue == value;
    var alreadyUpgraded = this.boardArray[row][col].upgraded;
    return emptySpot || (sameValue && !alreadyUpgraded);
  }



  refreshBoard() {
    for (var i = 0; i < gameOptions.boardSize.rows; i++) {
      for (var j = 0; j < gameOptions.boardSize.cols; j++) {
        var spritePosition = this.getTilePosition(i, j); // Returns the coordinates of the tile default position according to its row and column
        // Below we place the tile in its proper place
        this.boardArray[i][j].tileSprite.x = spritePosition.x;
        this.boardArray[i][j].tileSprite.y = spritePosition.y;
        var tileValue = this.boardArray[i][j].tileValue;

        if (tileValue > 0) {
          this.boardArray[i][j].tileSprite.visible = true;
          this.boardArray[i][j].tileSprite.setFrame(tileValue - 1);
          this.boardArray[i][j].upgraded = false;
        } else {
          this.boardArray[i][j].tileSprite.visible = false;
        }
      }
    }

    // After readjusting the tiles, add a tile. This subroutine sets the canMove variable to true again
    this.addTile();
  }



  moveTile(tile, point, upgrade) { // moveTile: handle all tile movement, position and depth
    this.movingTiles++;
    tile.depth = this.movingTiles;
    var distance = Math.abs(tile.x - point.x) + Math.abs(tile.y - point.y);

    this.tweens.add({
      targets: [tile],
      x: point.x,
      y: point.y,
      duration: gameOptions.tweenSpeed * distance / gameOptions.tileSize,
      callbackScope: this,
      onComplete: function () {
        if (upgrade) {
          this.upgradeTile(tile);
        } else {
          this.endTween(tile);
        }
      }
    })
  }



  upgradeTile(tile) { // Takes care of upgrading the tile to a bigger number, the result of the merge. Also creates a small animation when they merge
    this.growSound.play();
    tile.setFrame(tile.frame.name + 1);
    this.tweens.add({
      targets: [tile],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: gameOptions.tweenSpeed,
      yoyo: true,
      repeat: 1,
      callbackScope: this,
      onComplete: function () {
        this.endTween(tile);
      }
    })
    /*
    In a tween configuration object:
    "scaleX" is the size along horizontal axis, where 1 = original size.

    "scaleY" is the size along vertical axis, where 1 = original size.

    "yoyo" plays the tween forward and backward if set to true.

    "repeat" is the amount of times tween will be played.
    */
  }



  endTween(tile) {
    this.movingTiles--;
    tile.depth = 0;
    if (this.movingTiles == 0) {
      this.refreshBoard();
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
