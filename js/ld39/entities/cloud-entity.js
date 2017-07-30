var LD39 = LD39 || {};

LD39.CloudEntity = function(totalDuration) {
  LD39.Entity.call(this);

  var circle = new PIXI.Graphics();
  circle.beginFill(0xEEEEEE);
  circle.drawCircle(0, 0, 200);
  circle.endFill();
  // circle.alpha = 0.5;
  circle.x = 0;
  circle.y = 0;

  this.setSprite(circle);
}

LD39.CloudEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.CloudEntity.prototype.constructor = LD39.CloudEntity;

LD39.CloudEntity.prototype.update = function(delta) {
  LD39.Entity.prototype.update.call(this, delta);
}
