var LD39 = LD39 || {};

LD39.LevelScreen = function() {
  LD39.Screen.call(this, new LD39.World());

  // this.musicResource = "music/main";

  this.createLevel();
  this.createEntities();
}

LD39.LevelScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.LevelScreen.prototype.constructor = LD39.LevelScreen;

LD39.LevelScreen.prototype.createLevel = function() {
  var gridHeight = 18;
  var gridWidth = 25;

  for (var x = 0; x < gridWidth; x++) {
    var brickEntity = new LD39.BrickEntity();
    brickEntity.setPosition(16 + x * 32, 16);
    this.world.addEntity(brickEntity);
  }

  for (var x = 0; x < gridWidth; x++) {
    var brickEntity = new LD39.BrickEntity();
    brickEntity.setPosition(16 + x * 32, 32 * (gridHeight - 1) + 16);
    this.world.addEntity(brickEntity);
  }

  for (var y = 1; y < gridHeight - 1; y++) {
    var brickEntity = new LD39.BrickEntity();
    brickEntity.setPosition(16, 16 + 32 * y);
    this.world.addEntity(brickEntity);
  }

  for (var y = 1; y < gridHeight - 1; y++) {
    var brickEntity = new LD39.BrickEntity();
    brickEntity.setPosition(16 + (gridWidth - 1) * 32, 16 + 32 * y);
    this.world.addEntity(brickEntity);
  }
}

LD39.LevelScreen.prototype.createEntities = function() {
  var pacmanEntity = new LD39.PacmanEntity();
  pacmanEntity.setPosition(300, 300);
  this.world.addEntity(pacmanEntity);
  this.playerEntity = pacmanEntity;

  var ghostEntity = new LD39.GhostEntity();
  ghostEntity.setPosition(500, 300);
  this.world.addEntity(ghostEntity);
}

LD39.LevelScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
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

  var playerEntity = this.playerEntity;
  var coreSpeed = 150;
  up.press = function() {
    playerEntity.setVelocityY(-coreSpeed);
  };
  up.release = function() {
    playerEntity.setVelocityY(0);
  }

  down.press = function() {
    playerEntity.setVelocityY(coreSpeed);
  };
  down.release = function() {
    playerEntity.setVelocityY(0);
  }

  left.press = function() {
    playerEntity.setVelocityX(-coreSpeed);
  };
  left.release = function() {
    playerEntity.setVelocityX(0);
  }

  right.press = function() {
    playerEntity.setVelocityX(coreSpeed);
  };
  right.release = function() {
    playerEntity.setVelocityX(0);
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
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
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
