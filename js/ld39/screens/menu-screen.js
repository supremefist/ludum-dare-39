var LD39 = LD39 || {};

LD39.MenuScreen = function(playerState) {
  LD39.Screen.call(this);

  overlay = new PIXI.Graphics();
  overlay.beginFill(0x000000);
  overlay.drawRect(0, 0, 800, 600);
  overlay.endFill();
  this.stage.addChild(overlay);

  successMessage = new LD39.TextEntity("Running out of steam", 32, 0xffffff);
  successMessage.setPosition(successMessage.getHorizontalCenter(800), 50);
  this.stage.addChild(successMessage.sprite);

  instructionMessage = new LD39.TextEntity("Shovel coal into the furnace, create steam and use the steam to power the train.\nDon't let the steam chamber explode.", 14, 0xffffff);
  instructionMessage.setPosition(160, 120);
  this.stage.addChild(instructionMessage.sprite);

  var texture = PIXI.loader.resources["graphics/instructions"].texture;
  var instructionTexture = new PIXI.Texture(
    texture, new PIXI.Rectangle(0, 0, 223, 225));
  var instructionSprite = new PIXI.Sprite(instructionTexture);
  instructionSprite.position.set(400, 170);
  this.stage.addChild(instructionSprite);

  var guideMessage = new LD39.TextEntity("Coal     Furnace     Steam     Throttle", 14, 0xffffff);
  guideMessage.setPosition(390, 380);
  this.stage.addChild(guideMessage.sprite);

  instructionMessage = new LD39.TextEntity("Controls:\nRight - shovel coal\nUp - throttle forward\nDown - throttle backward\nSpace - brake", 14, 0xffffff);
  instructionMessage.setPosition(200, 280);
  this.stage.addChild(instructionMessage.sprite);

  nextStepsMessage = new LD39.TextEntity("Press 'ENTER' to start...", 16, 0xffffff);
  this.stage.addChild(nextStepsMessage.sprite);

  if (playerState != undefined) {
    instructionMessage.setText(playerState.reason);
  }


  nextStepsMessage.setPosition(nextStepsMessage.getHorizontalCenter(800), 500);
}

LD39.MenuScreen.prototype = Object.create(LD39.Screen.prototype);
LD39.MenuScreen.prototype.constructor = LD39.MenuScreen;

LD39.MenuScreen.prototype.update = function(delta) {
  LD39.Screen.prototype.update.call(this, delta);
}

LD39.MenuScreen.prototype.initialize = function(delta) {
  LD39.Screen.prototype.initialize.call(this, delta);
}

LD39.MenuScreen.prototype.initializeKeyboard = function() {
  var retryKey = this.keyboard(13);

  retryKey.press = function() {
    LD39.setCurrentScreen(new LD39.TrainRideScreen(1));
  };
  retryKey.release = function() {

  }
}
