var LD39 = LD39 || {};

LD39.Screen = function(world) {
  this.world = world;
  this.musicResource = null;
}

LD39.Screen.prototype.update = function(delta) {
  this.world.update(delta);
}

LD39.Screen.prototype.render = function(renderer) {
  this.world.render(renderer);
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
