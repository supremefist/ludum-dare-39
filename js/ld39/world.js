var LD39 = LD39 || {};

LD39.World = function() {
  this.stage = new PIXI.Container();
  this.entities = {};
}

LD39.World.prototype.addEntity = function(entity) {
  entity.setWorld(this);
  this.entities[entity.guid] = entity;
  this.stage.addChild(entity.sprite);
}

LD39.World.prototype.removeEntity = function(entity) {
  entity.setWorld(null);
  delete this.entities[entity.guid];
  this.stage.removeChild(entity.sprite);
}

LD39.World.prototype.update = function(delta) {
  var otherEntities = [];
  var staticEntities = [];

  for (var guid in this.entities) {
    var entity = this.entities[guid];
    if (entity.static) {
      staticEntities.push(entity);
    } else {
      otherEntities.push(entity);
    }
    entity.update(delta);
  }

  for (var guid in this.entities) {
    var entity = this.entities[guid];

    if (entity.static) {
      continue;
    }

    for (var i = 0; i < staticEntities.length; i++) {
      var staticEntity = staticEntities[i];

      if (LD39.bump.hitTestRectangle(entity.sprite.getBounds(), staticEntity.sprite.getBounds())) {
        entity.collidedWithObstacle(staticEntity);
      }
    }

    for (var i = 0; i < otherEntities.length; i++) {
      var otherEntity = otherEntities[i];

      if (entity == otherEntity) {
        // Can't collide with self
        continue;
      }

      if (LD39.bump.hitTestRectangle(entity.sprite.getBounds(), otherEntity.sprite.getBounds())) {
        entity.collidedWithEntity(otherEntity);
      }
    }
  }
}

LD39.World.prototype.render = function(renderer) {
  renderer.render(this.stage);
}
