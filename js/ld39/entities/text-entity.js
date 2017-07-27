var LD39 = LD39 || {};

LD39.TextEntity = function(message) {
  LD39.Entity.call(this);

  this.setSprite(new PIXI.Text(
    message,
    {fontFamily: "Arial", fontSize: 32, fill: "white"}
  ));
}

LD39.TextEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.TextEntity.prototype.constructor = LD39.TextEntity;

LD39.TextEntity.prototype.setText = function(message) {
  this.sprite.text = message;
}
