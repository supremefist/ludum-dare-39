var LD39 = LD39 || {};

LD39.SuccessScreen = function(playerState) {
  LD39.Screen.call(this);

  overlay = new PIXI.Graphics();
  overlay.beginFill(0x000000);
  overlay.drawRect(0, 0, 800, 600);
  overlay.endFill();
  this.stage.addChild(overlay);

  successMessage = new LD39.TextEntity("Success!", 32, 0xffffff);
  this.stage.addChild(successMessage.sprite);

  successReasonMessage = new LD39.TextEntity("", 16, 0xffffff);
  this.stage.addChild(successReasonMessage.sprite);

  nextStepsMessage = new LD39.TextEntity("Press 'ENTER' to continue...", 16, 0xffffff);
  this.stage.addChild(nextStepsMessage.sprite);

  if (playerState != undefined) {
    successReasonMessage.setText(playerState.reason);
  }

  successMessage.setPosition(successMessage.getHorizontalCenter(800), 250);
  successReasonMessage.setPosition(successReasonMessage.getHorizontalCenter(800), 410);
  nextStepsMessage.setPosition(nextStepsMessage.getHorizontalCenter(800), 450);
}

LD39.SuccessScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.SuccessScreen.prototype.constructor = LD39.SuccessScreen;

LD39.SuccessScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
}

LD39.SuccessScreen.prototype.initialize = function(delta) {
  LD39.Screen.prototype.initialize.call(this, delta);
}

LD39.SuccessScreen.prototype.initializeKeyboard = function() {
  var retryKey = this.keyboard(13);

  retryKey.press = function() {
    LD39.setCurrentScreen(new LD39.TrainRideScreen(3));
  };
  retryKey.release = function() {

  }
}
