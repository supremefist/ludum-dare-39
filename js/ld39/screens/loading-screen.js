var LD39 = LD39 || {};

LD39.LoadingScreen = function() {
  LD39.Screen.call(this);

  this.message = new PIXI.Text(
    "Loading: 0%",
    {fontFamily: "Arial", fontSize: 32, fill: "white"}
  );

  this.message.position.set(300, 250);

  this.stage.addChild(this.message);
}

LD39.LoadingScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.LoadingScreen.prototype.constructor = LD39.LoadingScreen;

LD39.LoadingScreen.prototype.loadProgressHandler = function(progress) {
  this.message.text = "Loading: " + progress + "%";
}

LD39.LoadingScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
}
