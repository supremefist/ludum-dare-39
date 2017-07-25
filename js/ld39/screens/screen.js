var LD39 = LD39 || {};

LD39.Screen = function() {
  this.stage = new PIXI.Container();
  this.musicResource = null;
}

LD39.Screen.prototype.update = function(delta) {

}

LD39.Screen.prototype.render = function(renderer) {
  renderer.render(this.stage);
}

LD39.Screen.prototype.initialize = function() {
  if (this.musicResource != null) {
    PIXI.loader.resources[this.musicResource].sound.play();
  }
}

LD39.Screen.prototype.terminate = function() {
  if (this.musicResource != null) {
    PIXI.loader.resources[this.musicResource].sound.stop();
  }
}
