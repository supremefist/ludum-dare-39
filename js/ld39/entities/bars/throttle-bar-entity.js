var LD39 = LD39 || {};

LD39.ThrottleBarEntity = function() {
  LD39.BarEntity.call(this);

  this.effectiveProgressValue = 0.3;
  this.progressValue = 0.3;

  var barSprite = new PIXI.Container();

  var barHeights = [30, 30, 30, 30, 30];
  var barRedness = [0.8, 0.8, 0.8, 0.5, 0.4];
  var barGreenness = [0.3, 0.4, 0.5, 0.5, 0.4];
  var barBlueness = [0.3, 0.4, 0.5, 0.5, 0.4];

  var currentY = 0;
  for (index = 0; index < barHeights.length; index++) {
    var barHeight = barHeights[index];
    var barRed = barRedness[index];
    var barGreen = barGreenness[index];
    var barBlue = barBlueness[index];

    var rectangle = new PIXI.Graphics();
    rectangle.beginFill(PIXI.utils.rgb2hex([barRed, barGreen, barBlue]));
    rectangle.drawRect(0, currentY, this.barWidth, barHeight);
    rectangle.endFill();
    barSprite.addChild(rectangle);

    currentY += barHeight;
  }

  this.totalBarHeight = currentY;

  var powerLine = new PIXI.Graphics();
  powerLine.lineStyle(4, 0x000000, 1);
  var sideOverFlow = 0.1;
  powerLine.moveTo(-this.barWidth * sideOverFlow, 0);
  powerLine.lineTo(this.barWidth * (1.0 + sideOverFlow), 0);
  powerLine.alpha = 0.5;
  powerLine.x = 0;
  powerLine.y = 0;
  barSprite.addChild(powerLine);
  this.powerLine = powerLine;

  var goalLine = new PIXI.Graphics();
  goalLine.lineStyle(4, 0x000000, 1);
  var sideOverFlow = 0.1;
  goalLine.moveTo(-this.barWidth * sideOverFlow, 0);
  goalLine.lineTo(this.barWidth * (1.0 + sideOverFlow), 0);
  goalLine.x = 0;
  goalLine.y = 0;
  barSprite.addChild(goalLine);
  this.goalLine = goalLine;

  this.sprite = barSprite;
}

LD39.ThrottleBarEntity.prototype = Object.create(LD39.BarEntity.prototype);
LD39.ThrottleBarEntity.prototype.constructor = LD39.ThrottleBarEntity;

LD39.ThrottleBarEntity.prototype.update = function(delta) {
  LD39.BarEntity.prototype.update.call(this, delta);

  this.powerLine.position.set(0, this.totalBarHeight * (1.0 - this.effectiveProgressValue));
  this.goalLine.position.set(0, this.totalBarHeight * (1.0 - this.getProgress()));
}
