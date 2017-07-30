var LD39 = LD39 || {};

LD39.TextEntity = function(message, fontSize, color) {
  LD39.Entity.call(this);

  this.font = {fontFamily: "Arial", fontSize: fontSize, fill: color};
  this.setSprite(new PIXI.Text(
    message,
    this.font
  ));
}

LD39.TextEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.TextEntity.prototype.constructor = LD39.TextEntity;

LD39.TextEntity.prototype.setText = function(message) {
  this.sprite.text = message;
}

LD39.TextEntity.prototype.getTextWidth = function() {
    // re-use canvas object for better performance
    var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = this.font.fontSize + "px " + this.font.fontFamily;
    var metrics = context.measureText(this.sprite.text);
    return metrics.width;
}

LD39.TextEntity.prototype.getHorizontalCenter = function(totalWidth) {
  var textWidth = this.getTextWidth();

  var centerPoint = totalWidth / 2;
  var startPointX = centerPoint - textWidth / 2;
  return startPointX;
}
