var LD39 = LD39 || {};

LD39.SmokeFactory = function() {
  this.stage = new PIXI.Container();

  // this.baseSmokeRate = 200;
  this.baseSmokeRate = 0;
  this.smokeRateVariance = 0.4;

  this.nextSmokeTime = 0;

  this.baseSmokeDuration = 2000;
  this.smokeDurationVariance = 0.4;

  this.smokeTime = 0;
  this.smokePosition = new PIXI.Point(0, 0);

  this.smokeEntities = {};
}

LD39.SmokeFactory.prototype.update = function(delta) {
  if (this.baseSmokeRate > 0) {
    this.smokeTime += delta;
  }

  if (this.smokeTime > this.nextSmokeTime) {
    this.smokeTime -= this.nextSmokeTime;

    this.addSmokeEntity();
  }

  for (var guid in this.smokeEntities) {
    var entity = this.smokeEntities[guid];

    entity.update(delta);

    if (entity.isExpired()) {
      delete this.smokeEntities[guid];
      this.stage.removeChild(entity.sprite);
    }
  }
}

LD39.SmokeFactory.prototype.setSmokePosition = function(x, y) {
  this.smokePosition.set(x, y);
}

LD39.SmokeFactory.prototype.updateSmokeOutput = function(movementMultiplier) {
  if (movementMultiplier == 0) {
    this.baseSmokeRate = 0;
  } else {
    this.baseSmokeRate = 50 + (3 - movementMultiplier) * 50;
  }
}

LD39.SmokeFactory.prototype.addSmokeEntity = function() {
  var finalDuration = this.baseSmokeDuration * (1.0 + Math.random() * this.smokeDurationVariance - this.smokeDurationVariance / 2);
  var newSmokeEntity = new LD39.SmokeEntity(this.baseSmokeDuration);

  newSmokeEntity.setPosition(this.smokePosition.x, this.smokePosition.y);
  this.smokeEntities[newSmokeEntity.guid] = newSmokeEntity;
  this.stage.addChild(newSmokeEntity.sprite);

  this.nextSmokeTime = this.baseSmokeRate * (1.0 + Math.random() * this.smokeRateVariance - this.smokeRateVariance / 2);
}
