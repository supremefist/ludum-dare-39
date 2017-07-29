var LD39 = LD39 || {};

LD39.TrainRideScreen = function() {
  LD39.Screen.call(this);

  this.locomotiveEntity = null;

  // this.musicResource = "music/main";

  this.level = null;
  this.trackGrounds = [];

  this.createLevel();
}

LD39.TrainRideScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.TrainRideScreen.prototype.constructor = LD39.TrainRideScreen;

LD39.TrainRideScreen.prototype.createLevel = function() {
  this.level = new LD39.Level01(this.stage);
}

LD39.TrainRideScreen.prototype.render = function(renderer) {
  LD39.Screen.prototype.render.call(this, renderer);
  renderer.backgroundColor = 0xcbdbfc;
  renderer.render(this.stage);
}

LD39.TrainRideScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
  this.level.update(delta);

  for (var index = 0; index < this.trackGrounds.length; index++) {
    this.stage.removeChild(this.trackGrounds[index]);
  }

  var trackPoints = this.level.track.getTrackPoints();
  for (var index = 1; index < trackPoints.length; index++) {
    var startPoint = trackPoints[index - 1];
    var endPoint = trackPoints[index];

    this.addGround(startPoint, endPoint);
  }
}

LD39.TrainRideScreen.prototype.addGround = function(startPoint, endPoint) {
  var trackGround = new PIXI.Graphics();
  var trainHeight = 400;

  trackGround.beginFill(0x4b692f);

  var drawPoints = [
    0, 0,
    endPoint.x, endPoint.y,
    endPoint.x, 600,
    0, 600
  ];

  trackGround.drawPolygon(drawPoints);

  trackGround.endFill();

  trackGround.x = startPoint.x;
  trackGround.y = startPoint.y + trainHeight;
  this.trackGrounds.push(trackGround);
  this.stage.addChild(trackGround);
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
