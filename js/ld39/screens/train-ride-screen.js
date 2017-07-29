var LD39 = LD39 || {};

LD39.TrainRideScreen = function() {
  LD39.Screen.call(this);

  // this.musicResource = "music/main";

  this.level = null;

  this.createLevel();
}

LD39.TrainRideScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.TrainRideScreen.prototype.constructor = LD39.TrainRideScreen;

LD39.TrainRideScreen.prototype.createLevel = function() {
  this.level = new LD39.Level01(this.stage);
}

LD39.TrainRideScreen.prototype.render = function(renderer) {
  renderer.backgroundColor = 0xcbdbfc;

  var locomotivePosition = this.level.locomotiveEntity.getPosition();
  this.stage.x = -locomotivePosition.x + 120;
  this.stage.y = -locomotivePosition.y + 300;
  renderer.render(this.stage);
}

LD39.TrainRideScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
  this.level.update(delta);
}

LD39.TrainRideScreen.prototype.initialize = function(delta) {
  LD39.Screen.prototype.initialize.call(this, delta);

  this.initializeKeyboard();
}

LD39.TrainRideScreen.prototype.initializeKeyboard = function() {
  var left = this.keyboard(37);
  var up = this.keyboard(38);
  var right = this.keyboard(39);
  var down = this.keyboard(40);

  var playerEntity = this.playerEntity;
  var coreSpeed = 25;
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

LD39.TrainRideScreen.prototype.keyboard = function(keyCode) {
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
