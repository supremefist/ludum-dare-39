var LD39 = LD39 || {};

LD39.TrainRideScreen = function() {
  LD39.Screen.call(this);

  // this.musicResource = "music/main";

  this.level = null;
  this.overlay = null;
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

  if (this.level.getPlayerState() == 'dead') {
    if (this.overlay != null) {
      return;
    }

    LD39.setCurrentScreen(new LD39.DeathScreen());

  } else {
    LD39.Screen.prototype.update.call(this, delta);
    this.level.update(delta);
  }
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

  right.press = function() {
    level.rightPress();
  };
  right.release = function() {
    level.rightRelease();
  }
}
