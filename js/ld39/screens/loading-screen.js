var LD39 = LD39 || {};

LD39.LoadingScreen = function() {
  LD39.Screen.call(this, new LD39.World());

  this.message = new LD39.TextEntity("Loading: 0%");

  this.message.setPosition(300, 250);

  this.world.addEntity(this.message);
}

LD39.LoadingScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.LoadingScreen.prototype.constructor = LD39.LoadingScreen;

LD39.LoadingScreen.prototype.loadProgressHandler = function(progress) {
  this.message.setText("Loading: " + progress + "%");
}

LD39.LoadingScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
}
