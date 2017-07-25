var LD39 = LD39 || {};

LD39.PacmanEntity = function() {
  LD39.Entity.call(this);

  var texture = PIXI.loader.resources["graphics/pacman"].texture;

  var pacmanTexture = new PIXI.Texture(
    texture, new PIXI.Rectangle(1, 1, 32, 32));
  var pacmanSprite = new PIXI.Sprite(pacmanTexture);

  this.sprite = pacmanSprite;
}

LD39.PacmanEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.PacmanEntity.prototype.constructor = LD39.PacmanEntity;
