var LD39 = LD39 || {};

LD39.BaseLevel = function(stage) {
  this.levelTitle = "Unknown";
  this.titleText = null;

  this.stage = stage;
  this.worldStage = new PIXI.Container();
  this.interfaceStage = new PIXI.Container();
  this.track = null;
  this.locomotiveEntity = null;
  this.idleDuration = 2000;

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
  if (this.idleDuration < 0) {
    if (this.titleText != null) {
      this.interfaceStage.removeChild(this.titleText.sprite);
      this.titleText = null;
    }
    Matter.Engine.update(this.physicsEngine, delta);
  } else if (this.titleText == null) {
    // this.titleText = new LD39.TextEntity(this.levelTitle, 32, 0x000000);
    // this.titleText.setPosition(this.titleText.getHorizontalCenter(800), 300);
    // this.interfaceStage.addChild(this.titleText.sprite);
  }

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

  if (this.idleDuration >= 0) {
    this.idleDuration -= delta;
  }

  this.updateCurrentTrackSegment();
  this.updateHelpMessage();
  this.updateIndicators();
}

LD39.BaseLevel.prototype.updateIndicators = function() {
  var changes = this.locomotiveEntity.currentParameters.changes;
  var minChange = 0.01;

  if (Math.abs(changes.coal) > minChange)  {
    if (changes.coal > 0) {
      this.coalBarEntity.indicateUp();
    } else {
      this.coalBarEntity.indicateDown();
    }

    changes['coal'] = 0;
  }

  if (Math.abs(changes.burningCoal) > minChange) {
    if (changes.burningCoal > 0) {
      this.burningCoalBarEntity.indicateUp();
    } else {
      this.burningCoalBarEntity.indicateDown();
    }

    changes['burningCoal'] = 0;
  }

  if (Math.abs(changes.steam) > minChange) {
    if (changes.steam > 0) {
      this.steamBarEntity.indicateUp();
    } else {
      this.steamBarEntity.indicateDown();
    }

    changes['steam'] = 0;
  }

}

LD39.BaseLevel.prototype.updateHelpMessage = function() {
  var coalAmount = this.locomotiveEntity.currentParameters.coal;
  var burningCoalAmount = this.locomotiveEntity.currentParameters.burningCoal;
  var steamAmount = this.locomotiveEntity.currentParameters.steam;
  var throttling = this.locomotiveEntity.currentParameters.throttle > 0;
  var inefficient = this.locomotiveEntity.currentParameters.throttle * 0.8 > this.locomotiveEntity.currentParameters.effectiveThrottle;

  if (steamAmount >= 1.0) {
    this.helperTextEntity.setText("Steam critical! (" + Math.round(steamAmount * 100) + "%)");
    this.additionalHelperTextEntity.setText("Throttle forward to release steam!");
  } else if (steamAmount > 0.8) {
    this.helperTextEntity.setText("Steam too high!");
    this.additionalHelperTextEntity.setText("Throttle forward to release steam!");
  } else if (steamAmount < 0.05) {
    this.helperTextEntity.setText("Low steam!");
    if (burningCoalAmount < 0.2) {
      this.additionalHelperTextEntity.setText("Press 'right' to shovel coal.");
    } else if ((throttling) && (inefficient)) {
      this.additionalHelperTextEntity.setText("Not at full power! Lower throttle to use less steam!");
    }
  } else if (burningCoalAmount > 0.95) {
    this.helperTextEntity.setText("Combustion chamber full!");
    this.additionalHelperTextEntity.setText("Wait for coal to burn before adding additional coal.");
  } else {
    this.helperTextEntity.setText("");
    this.additionalHelperTextEntity.setText("");
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

LD39.BaseLevel.prototype.createGround = function() {
  var padSprites = this.track.getTrackPhysicsObjects(true);
  for (var index = 0; index < padSprites.length; index++) {
    this.worldStage.addChild(padSprites[index]);
  }

  var levelPoints = this.track.getLevelPoints();
  for (var index = 1; index < levelPoints.length; index++) {
    var previousPoint = levelPoints[index - 1];
    var currentPoint = levelPoints[index];
    if (currentPoint.type == 'ground') {
      this.addVisibleGround(previousPoint, currentPoint);
    }
  }
}

LD39.BaseLevel.prototype.createBuildings = function() {
  var buildingLocations = this.track.getBuildingLocations();
  for (var index = 0; index < buildingLocations.length; index++) {
    var buildingLocation = buildingLocations[index];

    var buildingX = 1;
    var buildingY = 1;
    if (buildingLocation.type != null) {
      if (buildingLocation.type == 'station') {
        buildingX = 1;
        buildingY = 1;
      } else if (buildingLocation.type == 'factory') {
        buildingX = 131;
        buildingY = 1;
      } else if (buildingLocation.type == 'house') {
        buildingX = 261;
        buildingY = 1;
      } else {
        console.log("Invalid building type: " + buildingLocation.type);
      }

      var texture = PIXI.loader.resources["graphics/buildings"].texture;
      var buildingTexture = new PIXI.Texture(
        texture, new PIXI.Rectangle(buildingX, buildingY, 128, 64));
      var buildingSprite = new PIXI.Sprite(buildingTexture);

      buildingSprite.position.set(buildingLocation.x, buildingLocation.y - 64);
      // buildingSprite.position.set(32, -64);
      buildingSprite.anchor.set(0.5, 0.5);
      buildingSprite.scale.set(2.0, 2.0);
      this.worldStage.addChild(buildingSprite);
    }


  }

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

  this.additionalHelperTextEntity = new LD39.TextEntity("", 12, 0x000000);
  this.additionalHelperTextEntity.setPosition(interfaceX, interfaceY + 180);
  this.interfaceStage.addChild(this.additionalHelperTextEntity.sprite);

  this.stage.addChild(this.interfaceStage);
}

LD39.BaseLevel.prototype.createSky = function() {
  var trackRectangle = this.track.getBoundingRectangle();

  var cloudScapeX = trackRectangle.x;
  var cloudScapeY = trackRectangle.y - 400;
  var cloudScapeWidth = trackRectangle.width;
  var cloudScapeHeight = trackRectangle.height + 400;

  // var cloudScapeX = -800;
  // var cloudScapeY = -800;
  // var cloudScapeWidth = 1600;
  // var cloudScapeHeight = 1600;

  var baseCloudDensity = 200;
  var baseCloudDensityVariance = 0.2;
  var cloudDensity = baseCloudDensity * (1.0 + (Math.random() * baseCloudDensityVariance - baseCloudDensityVariance / 2));
  var cloudCount = Math.round(cloudScapeWidth / cloudDensity);

  var cloudStage = new PIXI.Container();
  for (var index = 0; index < cloudCount; index++) {
    var cloudX = cloudScapeX + cloudScapeWidth * Math.random();
    var cloudY = cloudScapeY + cloudScapeHeight * Math.random();

    var cloud = new LD39.CloudEntity();
    cloud.setPosition(cloudX, cloudY);
    this.worldStage.addChild(cloud.sprite);
  }

  // this.stage.addChild(cloudStage);
}

LD39.BaseLevel.prototype.createVisibleWorld = function() {
  this.createSky();
  this.createBuildings();
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

  Matter.World.add(this.physicsEngine.world, [this.locomotiveEntity.physicsBody]);

  this.locomotiveEntity.addToStage(this.worldStage);
}

LD39.BaseLevel.prototype.playExplosion = function() {
  PIXI.loader.resources['sounds/explosion'].sound.play();
}

LD39.BaseLevel.prototype.getPlayerState = function() {
  if (this.idleDuration > 0) {
    return {
      state: "busy",
      reason: "Healthy."
    }
  }

  var trackSegmentCount = this.track.points.length;
  var currentSegments = this.track.getSegmentsAtIndex(this.currentTrackSegmentIndex);
  var currentLocomotiveY = this.locomotiveEntity.getPosition().y;
  var minAllowableY = Math.max(currentSegments.start.y, currentSegments.end.y);

  if (this.locomotiveEntity.currentParameters.steam > 1.5) {
    this.playExplosion();
    return {
      state: "dead",
      reason: "Killed by steam chamber explosion."
    }
  } else if ((this.currentTrackSegmentIndex < 0) || (this.currentTrackSegmentIndex >= trackSegmentCount - 1)) {
    this.playExplosion();
    return {
      state: "dead",
      reason: "Killed by catastrophic collision."
    }
  } else if (currentLocomotiveY > minAllowableY) {
    this.playExplosion();
    return {
      state: "dead",
      reason: "You fell to your death."
    }
  } else if ((this.currentTrackSegmentIndex == trackSegmentCount - 4) && (this.locomotiveEntity.isStationary())) {
    return {
      state: "done",
      reason: "You delivered your cargo!"
    }
  } else {
    return {
      state: "busy",
      reason: "Healthy."
    }
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

LD39.BaseLevel.prototype.spacePress = function() {
  this.locomotiveEntity.applyBrakes();
}

LD39.BaseLevel.prototype.spaceRelease = function() {
  this.locomotiveEntity.releaseBrakes();
}
