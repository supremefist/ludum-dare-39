var LD39 = LD39 || {};

LD39.BaseLevel = function(stage) {
  this.stage = stage;
  this.worldStage = new PIXI.Container();
  this.interfaceStage = new PIXI.Container();
  this.track = null;
  this.locomotiveEntity = null;

  this.throttleBarEntity = null;

  this.physicsEngine = null;
  this.trackGrounds = [];

  this.createWorld();
  this.createInterface();
}

LD39.BaseLevel.prototype.update = function(delta) {
  Matter.Engine.update(this.physicsEngine, delta);

  this.locomotiveEntity.update(delta);
  this.throttleBarEntity.update(delta);
}

LD39.BaseLevel.prototype.createGround = function() {
  var padSprites = this.track.getTrackPhysicsObjects(true);
  for (var index = 0; index < padSprites.length; index++) {
    this.worldStage.addChild(padSprites[index]);
  }

  var trackPoints = this.track.getTrackPoints();
  for (var index = 1; index < trackPoints.length; index++) {
    var startPoint = trackPoints[index - 1];
    var endPoint = trackPoints[index];
    this.addVisibleGround(startPoint, endPoint);
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
  this.throttleBarEntity = new LD39.ThrottleBarEntity();
  this.throttleBarEntity.setPosition(50, 50);
  this.interfaceStage.addChild(this.throttleBarEntity.sprite);

  this.stage.addChild(this.interfaceStage);
}

LD39.BaseLevel.prototype.createVisibleWorld = function() {
  this.createStation();
  this.createGround();
}

LD39.BaseLevel.prototype.addVisibleGround = function(startPoint, endPoint) {
  var trackGround = new PIXI.Graphics();
  var trainHeight = 0;

  trackGround.beginFill(0x4b692f);

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
  trackGround.y = startPoint.y + trainHeight;
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
  this.worldStage.addChild(this.locomotiveEntity.sprite);
}

LD39.BaseLevel.prototype.createTrack = function() {

}
