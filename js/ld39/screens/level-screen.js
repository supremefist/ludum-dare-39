var LD39 = LD39 || {};

LD39.LevelScreen = function() {
  LD39.Screen.call(this);

  // this.musicResource = "music/main";

  var texture = PIXI.loader.resources["graphics/pacman"].texture;

  var pacmanTexture = new PIXI.Texture(texture, new PIXI.Rectangle(1, 1, 32, 32));
  var pacmanSprite = new PIXI.Sprite(pacmanTexture);
  pacmanSprite.x = 300;
  pacmanSprite.y = 300;
  pacmanSprite.vx = 0;
  pacmanSprite.vy = 0;
  this.stage.addChild(pacmanSprite);

  this.playerSprite = pacmanSprite;

  var ghostTexture = new PIXI.Texture(texture, new PIXI.Rectangle(1, 1, 32, 32));
  var ghostSprite = new PIXI.Sprite(ghostTexture);
  ghostSprite.x = 500;
  ghostSprite.y = 300;
  this.stage.addChild(ghostSprite);
}

LD39.LevelScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.LevelScreen.prototype.constructor = LD39.LevelScreen;

LD39.LevelScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);

  this.playerSprite.x += this.playerSprite.vx * (delta / 1000.0);
  this.playerSprite.y += this.playerSprite.vy * (delta / 1000.0);
}

LD39.LevelScreen.prototype.initialize = function(delta) {
  LD39.Screen.prototype.initialize.call(this, delta);

  this.initializeKeyboard();
}

LD39.LevelScreen.prototype.initializeKeyboard = function() {
  var left = this.keyboard(37);
  var up = this.keyboard(38);
  var right = this.keyboard(39);
  var down = this.keyboard(40);

  var playerSprite = this.playerSprite;
  var coreSpeed = 150;
  up.press = function() {
    playerSprite.vy = -coreSpeed;
  };
  up.release = function() {
    playerSprite.vy = 0;
  }

  down.press = function() {
    playerSprite.vy = coreSpeed;
  };
  down.release = function() {
    playerSprite.vy = 0;
  }

  left.press = function() {
    playerSprite.vx = -coreSpeed;
  };
  left.release = function() {
    playerSprite.vx = 0;
  }

  right.press = function() {
    playerSprite.vx = coreSpeed;
  };
  right.release = function() {
    playerSprite.vx = 0;
  }
}

LD39.LevelScreen.prototype.keyboard = function(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    // event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    // event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
