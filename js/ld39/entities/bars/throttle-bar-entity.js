var LD39 = LD39 || {};

LD39.ThrottleBarEntity = function() {
  LD39.BarEntity.call(this);

  var barSprite = new PIXI.Container();

  var barHeights = [60, 40, 30];
  var barRedness = [0.7, 0.0, 0.0];
  var barBlueness = [0.0, 0.0, 0.7];

  var currentY = 0;
  for (index = 0; index < barHeights.length; index++) {
    var barHeight = barHeights[index];
    var barRed = barRedness[index];
    var barBlue = barBlueness[index];

    var rectangle = new PIXI.Graphics();
    rectangle.beginFill(PIXI.utils.rgb2hex([barRed, 0.7, barBlue]));
    rectangle.drawRect(0, currentY, this.barWidth, barHeight);
    rectangle.endFill();
    barSprite.addChild(rectangle);

    currentY += barHeight;
  }

  this.sprite = barSprite;
}

LD39.ThrottleBarEntity.prototype = Object.create(LD39.BarEntity.prototype);
LD39.ThrottleBarEntity.prototype.constructor = LD39.ThrottleBarEntity;
