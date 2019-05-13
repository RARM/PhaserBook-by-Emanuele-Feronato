var game; // The game variable is outside of the window.onload scope os it is accessible to the resizeGame subroutine

window.onload = function() { // The onload event (for the windows) fires after all objects in the DOM hierarchy have finished loading
  var gameConfig = {
    /* gameConfig: contains some game settings such as width, height and background color
       We are also passing gameConfig as an argument into the Phaser.Game at the game variable */
    width: 480,
    height:  640,
    backgroundColor: 0xff0000,
    scene: playGame // Phaser scenes take care of cleaning memory and resource management
  }


  game = new Phaser.Game(gameConfig); // Creating a new instance of a Phaser game

  window.focus(); // Sets focus to the current window, if you don't focus the current window, keyboard input may not word
  resizeGame(); // Adjust the game size the first time the page is loaded
  window.addEventListener("resize", resizeGame); // Adjust the game size every time the window is resized
}





// Game scenes
class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  create() {
    console.log("This is my awesome game");
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
