var LD39 = LD39 || {};

LD39.BarEntity = function() {
  LD39.Entity.call(this);

  this.progressValue = 0.5;
  this.barWidth = 40;
}

LD39.BarEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.BarEntity.prototype.constructor = LD39.BarEntity;

LD39.BarEntity.prototype.update = function(delta) {
  LD39.Entity.prototype.update.call(this, delta);
}

LD39.BarEntity.setProgress = function(progressValue) {
  this.progressValue = progressValue;
}

LD39.BarEntity.getProgress = function() {
  return this.progressValue;
}
