var LD39 = LD39 || {};

LD39.SmokeEntity = function(totalDuration) {
  LD39.Entity.call(this);

  this.totalDuration = totalDuration;
  this.remainingDuration = totalDuration;

  this.baseRiseRate = 20;
  this.riseRateVariance = 0.4
  this.riseRate = this.baseRiseRate * (1.0 + Math.random() * this.riseRateVariance - this.riseRateVariance / 2);

  this.baseDriftRate = 20;
  this.driftRateVariance = 0.4
  this.driftRate = this.baseDriftRate * (Math.random() * this.driftRateVariance - this.driftRateVariance / 2);

  var circle = new PIXI.Graphics();
  circle.beginFill(0xEEEEEE);
  circle.drawCircle(0, 0, 4);
  circle.endFill();
  // circle.alpha = 0.5;
  circle.x = 0;
  circle.y = 0;

  this.setSprite(circle);
}

LD39.SmokeEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.SmokeEntity.prototype.constructor = LD39.SmokeEntity;

LD39.SmokeEntity.prototype.update = function(delta) {
  LD39.Entity.prototype.update.call(this, delta);

  var alpha = Math.max(0, this.remainingDuration / this.totalDuration);
  this.sprite.alpha = alpha;

  this.remainingDuration -= delta;

  this.sprite.position.x -= (delta / 1000) * this.driftRate;
  this.sprite.position.y -= (delta / 1000) * this.riseRate;
}

LD39.SmokeEntity.prototype.isExpired = function() {
  return this.remainingDuration <= 0;
}
