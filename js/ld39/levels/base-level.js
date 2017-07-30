var LD39 = LD39 || {};

LD39.BaseLevel = function(stage) {
  this.stage = stage;
  this.worldStage = new PIXI.Container();
  this.interfaceStage = new PIXI.Container();
  this.track = null;
  this.locomotiveEntity = null;
  this.idleDuration = 1000;

  this.throttleBarEntity = null;
  this.coalBarEntity = null;
  this.burningCoalBarEntity = null;
  this.steamBarEntity = null;
  this.helperTextEntity = null;

  this.physicsEngine = null;
  this.trackGrounds = [];

  this.currentTrackSegmentIndex = 0;

  this.createWorld();
  this.createInterface();
}

LD39.BaseLevel.prototype.update = function(delta) {
  Matter.Engine.update(this.physicsEngine, delta);

  this.locomotiveEntity.update(delta);

  this.coalBarEntity.setProgress(this.locomotiveEntity.currentParameters['coal']);
  this.coalBarEntity.update(delta);

  this.burningCoalBarEntity.setProgress(this.locomotiveEntity.currentParameters['burningCoal']);
  this.burningCoalBarEntity.update(delta);

  this.steamBarEntity.setProgress(this.locomotiveEntity.currentParameters['steam']);
  this.steamBarEntity.update(delta);

  var throttle = this.locomotiveEntity.currentParameters['throttle'];
  var effectiveThrottle = this.locomotiveEntity.currentParameters['effectiveThrottle'];
  this.throttleBarEntity.setProgress(throttle);
  this.throttleBarEntity.effectiveProgressValue = effectiveThrottle;
  this.throttleBarEntity.update(delta);

  this.locomotiveEntity.setThrottle(throttle);

  if (this.idleDuration > 0) {
    this.idleDuration -= delta;

    if (this.idleDuration < 0) {
      this.startLevel();
    }
  }

  this.updateCurrentTrackSegment();
  this.updateHelpMessage();
}

LD39.BaseLevel.prototype.updateHelpMessage = function() {
  var coalAmount = this.locomotiveEntity.currentParameters.coal;
  var burningCoalAmount = this.locomotiveEntity.currentParameters.burningCoal;
  var steamAmount = this.locomotiveEntity.currentParameters.steam;

  if (steamAmount >= 1.0) {
    this.helperTextEntity.setText("Steam critical! (" + Math.round(steamAmount * 100) + "%)");
  } else if (steamAmount > 0.8) {
    this.helperTextEntity.setText("Steam too high!");
  } else if (steamAmount < 0.05) {
    this.helperTextEntity.setText("Low steam!");
  } else if (burningCoalAmount > 0.95) {
    this.helperTextEntity.setText("Combustion chamber full!");
  } else {
    this.helperTextEntity.setText("");
  }
}

LD39.BaseLevel.prototype.updateCurrentTrackSegment = function() {
  var currentTrackSegments = this.track.getSegmentsAtIndex(this.currentTrackSegmentIndex);

  var currentLocomotiveX = this.locomotiveEntity.getPosition().x;

  var currentStartX = -Infinity;
  if (currentTrackSegments.start != null) {
    currentStartX = currentTrackSegments.start.x;
  }
  var currentEndX = Infinity;
  if (currentTrackSegments.end != null) {
    currentEndX = currentTrackSegments.end.x;
  }

  if (currentLocomotiveX < currentStartX) {
    this.currentTrackSegmentIndex -= 1;
    this.updateCurrentTrackSegment();
  } else if (currentLocomotiveX > currentEndX) {
    this.currentTrackSegmentIndex += 1;
    this.updateCurrentTrackSegment();
  }
}

LD39.BaseLevel.prototype.startLevel = function() {
  // this.locomotiveEntity.setPhysicsPosition(0, -22);
  this.locomotiveEntity.setStatic(false);
}

LD39.BaseLevel.prototype.createGround = function() {
  var padSprites = this.track.getTrackPhysicsObjects(true);
  for (var index = 0; index < padSprites.length; index++) {
    this.worldStage.addChild(padSprites[index]);
  }

  var levelPoints = this.track.getLevelPoints();
  for (var index = 1; index < levelPoints.length; index++) {
    var previousPoint = levelPoints[index - 1];
    var currentPoint = levelPoints[index];
    this.addVisibleGround(previousPoint, currentPoint);
  }
}

LD39.BaseLevel.prototype.createStation = function() {
  var texture = PIXI.loader.resources["graphics/buildings"].texture;
  var stationTexture = new PIXI.Texture(
    texture, new PIXI.Rectangle(1, 1, 128, 64));
  var stationSprite = new PIXI.Sprite(stationTexture);
  stationSprite.position.set(32, -64);
  stationSprite.anchor.set(0.5, 0.5);
  stationSprite.scale.set(2.0, 2.0);
  this.worldStage.addChild(stationSprite);
}

LD39.BaseLevel.prototype.updateCamera = function() {
  var locomotivePosition = this.locomotiveEntity.getPosition();
  var corePositionX = -Math.floor(locomotivePosition.x) + 120;
  var corePositionY = -Math.floor(locomotivePosition.y) + 400;
  this.worldStage.position.set(corePositionX, corePositionY);

  // this.interfaceStage.position.set(corePositionX - 200, corePositionY - 860);
}

LD39.BaseLevel.prototype.createWorld = function() {
  this.createTrack();
  this.createPhysicsWorld();
  this.createVisibleWorld();
  this.createEntities();

  this.stage.addChild(this.worldStage);
}

LD39.BaseLevel.prototype.createInterface = function() {
  var interfaceX = 10;
  var interfaceY = 10;

  this.coalBarEntity = new LD39.ResourceBarEntity(0.2, 0.2, 0.3, 0, 0, 0, false);
  this.coalBarEntity.setPosition(interfaceX, interfaceY);
  this.coalBarEntity.setProgress(1.0);
  this.interfaceStage.addChild(this.coalBarEntity.sprite);

  this.burningCoalBarEntity = new LD39.BurningCoalBarEntity(0.8, 0.5, 0.0, 0.2, 0.1, 0, false);
  this.burningCoalBarEntity.setPosition(interfaceX + 25, interfaceY);
  this.burningCoalBarEntity.setProgress(0.0);
  this.interfaceStage.addChild(this.burningCoalBarEntity.sprite);

  this.steamBarEntity = new LD39.ResourceBarEntity(0.6, 0.6, 1.0, 0.1, 0.1, 0.5, true);
  this.steamBarEntity.setPosition(interfaceX + 50, interfaceY);
  this.steamBarEntity.setProgress(0.0);
  this.interfaceStage.addChild(this.steamBarEntity.sprite);

  this.throttleBarEntity = new LD39.ThrottleBarEntity();
  this.throttleBarEntity.setPosition(interfaceX + 75, interfaceY);
  this.interfaceStage.addChild(this.throttleBarEntity.sprite);

  this.helperTextEntity = new LD39.TextEntity("", 16, 0x000000);
  this.helperTextEntity.setPosition(interfaceX, interfaceY + 160);
  this.interfaceStage.addChild(this.helperTextEntity.sprite);

  this.stage.addChild(this.interfaceStage);
}

LD39.BaseLevel.prototype.createVisibleWorld = function() {
  this.createStation();
  this.createGround();
}

LD39.BaseLevel.prototype.addVisibleGround = function(startPoint, endPoint) {
  var trackGround = new PIXI.Graphics();

  trackGround.beginFill(0x4b692f);

  var grountType = endPoint.type;

  var relativeStartX = 0;
  var relativeStartY = 0;
  var relativeEndX = endPoint.x - startPoint.x;
  var relativeEndY = endPoint.y - startPoint.y;

  var drawPoints = [
    relativeStartX, relativeStartY,
    relativeEndX, relativeEndY,
    relativeEndX, 600,
    relativeStartX, 600
  ];

  trackGround.drawPolygon(drawPoints);

  trackGround.endFill();

  trackGround.x = startPoint.x;
  trackGround.y = startPoint.y;
  this.trackGrounds.push(trackGround);
  this.worldStage.addChild(trackGround);
}

LD39.BaseLevel.prototype.createPhysicsWorld = function() {
  this.physicsEngine = Matter.Engine.create();

  var pads = this.track.getTrackPhysicsObjects(false);
  Matter.World.add(this.physicsEngine.world, pads);
}

LD39.BaseLevel.prototype.createEntities = function() {
  this.locomotiveEntity = new LD39.LocomotiveEntity();
  this.locomotiveEntity.setPosition(0, -21);
  this.locomotiveEntity.setPhysicsPosition(0, -21);
  this.locomotiveEntity.setStatic(true);

  Matter.World.add(this.physicsEngine.world, [this.locomotiveEntity.physicsBody]);

  this.locomotiveEntity.addToStage(this.worldStage);
}

LD39.BaseLevel.prototype.getPlayerState = function() {
  if (this.locomotiveEntity.currentParameters.steam > 1.5) {
    return {
      state: "dead",
      reason: "Killed by steam chamber explosion."
    }
  } else if ((this.currentTrackSegmentIndex < 0) || (this.currentTrackSegmentIndex >= this.track.points.length - 1)) {
    return {
      state: "dead",
      reason: "Killed by catastrophic collision."
    }
  }
  return {
    state: "alive",
    reason: "Healthy."
  }
}

LD39.BaseLevel.prototype.createTrack = function() {

}

LD39.BaseLevel.prototype.upPress = function() {
  this.locomotiveEntity.accelerate();
}

LD39.BaseLevel.prototype.upRelease = function() {

}

LD39.BaseLevel.prototype.downPress = function() {
  this.locomotiveEntity.decelerate();
}

LD39.BaseLevel.prototype.downRelease = function() {

}

LD39.BaseLevel.prototype.rightPress = function() {
  this.locomotiveEntity.feedCoal();
}

LD39.BaseLevel.prototype.rightRelease = function() {

}
