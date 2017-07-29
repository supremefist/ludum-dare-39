var LD39 = LD39 || {};

LD39.BarEntity = function() {
  LD39.Entity.call(this);

  this.progressValue = 0.5;
  this.barWidth = 20;
  this.totalBarHeight = 0;
}

LD39.BarEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.BarEntity.prototype.constructor = LD39.BarEntity;

LD39.BarEntity.prototype.update = function(delta) {
  LD39.Entity.prototype.update.call(this, delta);
}

LD39.BarEntity.prototype.setProgress = function(progressValue) {
  this.progressValue = progressValue;
}

LD39.BarEntity.prototype.getProgress = function() {
  return this.progressValue;
}

LD39.BarEntity.prototype.changeProgress = function(delta) {
  if ((this.progressValue + delta > 1.0) || (this.progressValue + delta < 0.0)) {
    return;
  }

  this.progressValue += delta;
  this.progressValue = Math.min(1.0, this.progressValue);
  this.progressValue = Math.max(0.0, this.progressValue);
}
