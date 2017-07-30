var LD39 = LD39 || {};

LD39.BurningCoalBarEntity = function(startRed, startGreen, startBlue, endRed, endGreen, endBlue, flashing) {
  LD39.ResourceBarEntity.call(this, startRed, startGreen, startBlue, endRed, endGreen, endBlue, flashing);
}

LD39.BurningCoalBarEntity.prototype = Object.create(LD39.ResourceBarEntity.prototype);
LD39.BurningCoalBarEntity.prototype.constructor = LD39.BurningCoalBarEntity;

LD39.BurningCoalBarEntity.prototype.update = function(delta) {
  LD39.ResourceBarEntity.prototype.update.call(this, delta);
}
