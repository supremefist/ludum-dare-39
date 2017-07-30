var LD39 = LD39 || {};

LD39.DeathScreen = function(playerState) {
  LD39.Screen.call(this);

  overlay = new PIXI.Graphics();
  overlay.beginFill(0x000000);
  overlay.drawRect(0, 0, 800, 600);
  overlay.endFill();
  this.stage.addChild(overlay);

  deathMessage = new LD39.TextEntity("Your train was destroyed!", 32, 0xffffff);
  this.stage.addChild(deathMessage.sprite);

  deathReasonMessage = new LD39.TextEntity("", 16, 0xffffff);
  this.stage.addChild(deathReasonMessage.sprite);

  nextStepsMessage = new LD39.TextEntity("Press 'space' to try again...", 16, 0xffffff);
  this.stage.addChild(nextStepsMessage.sprite);

  if (playerState != undefined) {
    deathReasonMessage.setText(playerState.reason);
  }

  deathMessage.setPosition(deathMessage.getHorizontalCenter(800), 250);
  deathReasonMessage.setPosition(deathReasonMessage.getHorizontalCenter(800), 410);
  nextStepsMessage.setPosition(nextStepsMessage.getHorizontalCenter(800), 450);
}

LD39.DeathScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.DeathScreen.prototype.constructor = LD39.DeathScreen;

LD39.DeathScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
}

LD39.DeathScreen.prototype.initialize = function(delta) {
  LD39.Screen.prototype.initialize.call(this, delta);
}

LD39.DeathScreen.prototype.initializeKeyboard = function() {
  var retryKey = this.keyboard(32);

  retryKey.press = function() {
    LD39.setCurrentScreen(new LD39.TrainRideScreen());
  };
  retryKey.release = function() {

  }
}
