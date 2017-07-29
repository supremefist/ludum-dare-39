var LD39 = LD39 || {};

LD39.Entity = function() {
  this.sprite = null;

  this.world = null;
  this.static = false;
  this.velocityX = 0;
  this.velocityY = 0;
  this.guid = LD39.Entity.getNextGuid();
}

LD39.Entity.nextGuid = 0;
LD39.Entity.getNextGuid = function() {
  LD39.Entity.nextGuid += 1;
  return LD39.Entity.nextGuid;
}

LD39.Entity.prototype.update = function(delta) {

}

LD39.Entity.prototype.setWorld = function(world) {
  this.world = world;
}

LD39.Entity.prototype.setSprite = function(sprite) {
  this.sprite = sprite;
  // this.sprite.anchor.set(0.5, 0.5);
}

LD39.Entity.prototype.getRotation = function() {
  return this.sprite.rotation;
}

LD39.Entity.prototype.setRotation = function(rotation) {
  this.sprite.rotation = rotation;
}

LD39.Entity.prototype.getPosition = function() {
  return this.sprite.position;
}

LD39.Entity.prototype.setPosition = function(x, y) {
  this.sprite.position.set(x, y);
}

LD39.Entity.prototype.getVelocityX = function() {
  return this.velocityX;
}

LD39.Entity.prototype.getVelocityY = function() {
  return this.velocityY;
}

LD39.Entity.prototype.setVelocityX = function(velocityX) {
  this.velocityX = velocityX;
}

LD39.Entity.prototype.setVelocityY = function(velocityY) {
  this.velocityY = velocityY;
}
