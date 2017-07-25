var LD39 = LD39 || {};

LD39.World = function() {
  this.stage = new PIXI.Container();
  this.entities = [];
}

LD39.World.prototype.addEntity = function(entity) {
  this.entities.push(entity);
  this.stage.addChild(entity.sprite);
}

LD39.World.prototype.removeEntity = function(entity) {
  var index = 0;
  for (var existingEntity in this.entities) {
    if (entity == existingEntity) {
      this.entities.splice(index, 1);
    }
  }
  this.stage.removeChild(entity.sprite);
}

LD39.World.prototype.update = function(delta) {
  for (var i = 0; i < this.entities.length; i++) {
    var entity = this.entities[i];
    entity.update(delta);
  }
}

LD39.World.prototype.render = function(renderer) {
  renderer.render(this.stage);
}
