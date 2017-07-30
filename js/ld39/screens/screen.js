var LD39 = LD39 || {};

LD39.Screen = function(world) {
  this.stage = new PIXI.Container();
  this.musicResource = null;
}

LD39.Screen.prototype.update = function(delta) {
}

LD39.Screen.prototype.render = function(renderer) {
  renderer.render(this.stage);
}

LD39.Screen.prototype.initializeKeyboard = function() {
}

LD39.Screen.prototype.initialize = function() {
  this.initializeKeyboard();

  if (this.musicResource != null) {
    PIXI.loader.resources[this.musicResource].sound.play();
  }
}

LD39.Screen.prototype.terminate = function() {
  if (this.musicResource != null) {
    PIXI.loader.resources[this.musicResource].sound.stop();
  }
}

LD39.Screen.prototype.keyboard = function(keyCode) {
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
