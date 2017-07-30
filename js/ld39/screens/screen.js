var LD39 = LD39 || {};

LD39.Screen = function(world) {
  this.stage = new PIXI.Container();
  this.musicResource = null;
  this.eventListeners = [];
}

LD39.Screen.prototype.update = function(delta) {
}

LD39.Screen.prototype.render = function(renderer) {
  renderer.render(this.stage);
}

LD39.Screen.prototype.initializeKeyboard = function() {
}

LD39.Screen.prototype.clearKeyboard = function() {

}

LD39.Screen.prototype.initialize = function() {
  this.initializeKeyboard();

  if (this.musicResource != null) {
    PIXI.loader.resources[this.musicResource].sound.play();
  }
}

LD39.Screen.prototype.terminate = function() {
  this.clearEventListeners();

  if (this.musicResource != null) {
    PIXI.loader.resources[this.musicResource].sound.stop();
  }
}

LD39.Screen.prototype.clearEventListeners = function() {
  for (var index = 0; index < this.eventListeners.length; index++) {
    var eventListener = this.eventListeners[index];

    window.removeEventListener(eventListener.type, eventListener.handler, eventListener.useCapture);
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
  downEvent = {
    "type": "keydown",
    "handler": key.downHandler.bind(key),
    "useCapture": false
  }
  window.addEventListener(
    downEvent.type, downEvent.handler, downEvent.useCapture
  );
  this.eventListeners.push(downEvent);

  upEvent = {
    "type": "keyup",
    "handler": key.upHandler.bind(key),
    "useCapture": false
  }
  window.addEventListener(
    upEvent.type, upEvent.handler, upEvent.useCapture
  );
  this.eventListeners.push(upEvent);



  return key;
}
