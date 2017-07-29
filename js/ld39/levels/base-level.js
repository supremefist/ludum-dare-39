var LD39 = LD39 || {};

LD39.BaseLevel = function(stage) {
  this.stage = stage;
  this.track = null;
  this.locomotiveEntity = null;
  this.physicsEngine = null;

  this.createTrack();
  this.createPhysicsWorld();
  this.createEntities();
}

LD39.BaseLevel.prototype.update = function(delta) {
  Matter.Engine.update(this.physicsEngine, delta);

  this.locomotiveEntity.update(delta);
}

LD39.BaseLevel.prototype.createPhysicsWorld = function() {
  this.physicsEngine = Matter.Engine.create();

  var pads = this.track.getTrackPhysicsObjects(false);
  Matter.World.add(this.physicsEngine.world, pads);

  var padSprites = this.track.getTrackPhysicsObjects(true);
  for (var index = 0; index < padSprites.length; index++) {
    this.stage.addChild(padSprites[index]);
  }
}

LD39.BaseLevel.prototype.createEntities = function() {
  this.locomotiveEntity = new LD39.LocomotiveEntity();
  this.locomotiveEntity.setPosition(100, 100);
  this.locomotiveEntity.setPhysicsPosition(100, 100);

  Matter.World.add(this.physicsEngine.world, [this.locomotiveEntity.physicsBody]);
  this.stage.addChild(this.locomotiveEntity.sprite);
}

LD39.BaseLevel.prototype.createTrack = function() {

}
