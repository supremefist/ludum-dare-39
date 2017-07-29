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

  this.initializeKeyboard();
}

LD39.TrainRideScreen.prototype.render = function(renderer) {
  this.level.updateCamera();

  renderer.backgroundColor = 0xcbdbfc;
  renderer.render(this.stage);
}

LD39.TrainRideScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
  this.level.update(delta);
}

LD39.TrainRideScreen.prototype.initialize = function(delta) {
  LD39.Screen.prototype.initialize.call(this, delta);
}

LD39.TrainRideScreen.prototype.initializeKeyboard = function() {
  var left = this.keyboard(37);
  var up = this.keyboard(38);
  var right = this.keyboard(39);
  var down = this.keyboard(40);

  var playerEntity = this.playerEntity;
  var coreSpeed = 25;
  var level = this.level;

  up.press = function() {
    level.upPress();
  };
  up.release = function() {
    level.upRelease();
  }

  down.press = function() {
    level.downPress();
  };
  down.release = function() {
    level.downRelease();
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
