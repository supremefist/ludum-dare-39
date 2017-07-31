var LD39 = LD39 || {};

LD39.LoadingScreen = function() {
  LD39.Screen.call(this);

  this.message = new LD39.TextEntity("Loading: 0%", 32, 0xffffff);

  this.message.setPosition(300, 250);

  this.stage.addChild(this.message.sprite);
}

LD39.LoadingScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.LoadingScreen.prototype.constructor = LD39.LoadingScreen;

LD39.LoadingScreen.prototype.loadProgressHandler = function(progress) {
  this.message.setText("Loading: " + progress.toFixed(2) + "%");
}

LD39.LoadingScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
}
