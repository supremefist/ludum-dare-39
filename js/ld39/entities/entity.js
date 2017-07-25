var LD39 = LD39 || {};

LD39.Entity = function() {
  this.sprite = null;

  this.velocityX = 0;
  this.velocityY = 0;
}

LD39.Entity.prototype.update = function(delta) {
  this.move(delta);
}

LD39.Entity.prototype.move = function(delta) {
  var position = this.getPosition();

  this.setPosition(
    position.x + this.getVelocityX() * (delta / 1000.0),
    position.y + this.getVelocityY() * (delta / 1000.0));
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
