var LD39 = LD39 || {};

LD39.GhostEntity = function() {
  LD39.Entity.call(this);

  var texture = PIXI.loader.resources["graphics/pacman"].texture;
  var ghostTexture = new PIXI.Texture(
    texture, new PIXI.Rectangle(1, 35, 32, 32));
  var ghostSprite = new PIXI.Sprite(ghostTexture);

  // console.log(LD39.renderer.extract.pixels(ghostSprite));
  this.setSprite(ghostSprite);
}

LD39.GhostEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.GhostEntity.prototype.constructor = LD39.GhostEntity;
