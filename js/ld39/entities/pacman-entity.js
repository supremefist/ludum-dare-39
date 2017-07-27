var LD39 = LD39 || {};

LD39.PacmanEntity = function() {
  LD39.Entity.call(this);

  this.previousX = 0;
  this.previousY = 0;
  var texture = PIXI.loader.resources["graphics/pacman"].texture;

  var pacmanFrameTextures = [];
  for (var i = 0; i < 2; i++) {
    pacmanFrameTextures.push(new PIXI.Texture(
      texture, new PIXI.Rectangle(1 + i * 34, 1, 32, 32)));
  }

  var pacmanSprite = new PIXI.extras.AnimatedSprite(pacmanFrameTextures);
  pacmanSprite.animationSpeed = 0.1;
  this.setSprite(pacmanSprite);

  this.movementTimer = 0;
  this.movementAlternator = true;
  this.alreadyMoving = false;
}

LD39.PacmanEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.PacmanEntity.prototype.constructor = LD39.PacmanEntity;

LD39.PacmanEntity.prototype.update = function(delta) {
  LD39.Entity.prototype.update.call(this, delta);
  this.interpretMovement(delta);
}

LD39.PacmanEntity.prototype.setPosition = function(x, y) {
  var position = this.getPosition();
  this.previousX = position.x;
  this.previousY = position.y;

  LD39.Entity.prototype.setPosition.call(this, x, y);
}

LD39.PacmanEntity.prototype.revertToLastPosition = function() {
  this.setPosition(this.previousX, this.previousY);
}

LD39.PacmanEntity.prototype.collidedWithObstacle = function(obstacle) {
  LD39.Entity.prototype.collidedWithObstacle.call(this, obstacle);

  this.revertToLastPosition();
}

LD39.PacmanEntity.prototype.collidedWithEntity = function(entity) {
  LD39.Entity.prototype.collidedWithEntity.call(this, entity);

  this.world.removeEntity(entity);
}


LD39.PacmanEntity.prototype.interpretMovement = function(delta) {
  var moving = false;
  if (this.velocityX > 0) {
    this.sprite.scale.x = 1.0;
    this.sprite.rotation = 0;
    moving = true;
  } else if (this.velocityX < 0) {
    this.sprite.scale.x = -1.0;
    this.sprite.rotation = 0;
    moving = true;
  }

  if (this.velocityY > 0) {
    this.sprite.rotation = Math.PI * 0.5;
    this.sprite.scale.x = 1.0;
    moving = true;
  } else if (this.velocityY < 0) {
    this.sprite.rotation = Math.PI * 1.5;
    this.sprite.scale.x = 1.0;
    moving = true;
  }

  if (moving) {
    this.movementTimer += delta;
    if (!this.alreadyMoving) {
      this.sprite.play();
    }
    this.alreadyMoving = true;
  } else {
    if (this.alreadyMoving) {
      this.sprite.gotoAndStop(0);
    }
    this.alreadyMoving = false;
  }

  if (this.movementTimer > 200) {
    if (this.movementAlternator) {
      PIXI.loader.resources["sounds/bump_b"].sound.play();
      this.movementAlternator = false;
    } else {
      PIXI.loader.resources["sounds/bump_c"].sound.play();
      this.movementAlternator = true;
    }

    this.movementTimer = 0;
  }
}
