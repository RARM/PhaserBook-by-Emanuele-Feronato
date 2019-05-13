window.onload = function() { // The onload event (for the windows) fires after all objects in the DOM hierarchy have finished loading
  var gameConfig = {
    /* gameConfig: contains some game settings such as width, height and background color
       We are also passing gameConfig as an argument into the Phaser.Game at the game variable */
    width: 480,
    height:  640,
    backgroundColor: 0xff0000
  }


  var game = new Phaser.Game(gameConfig); // Creating a new instance of a Phaser game
}
