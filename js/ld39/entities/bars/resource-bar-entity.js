var LD39 = LD39 || {};

LD39.ResourceBarEntity = function(startRed, startGreen, startBlue, endRed, endGreen, endBlue, flashing) {
  LD39.BarEntity.call(this);

  this.barCount = 15;
  this.barHeight = (1.0 / this.barCount);
  this.progressValue = 0.0;
  this.flashing = flashing;
  this.flashTimer = 0;
  this.flashOn = true;
  this.flashRate = 250;

  var barSprite = new PIXI.Container();

  var barRedness = [];
  var barGreenness = [];
  var barBlueness = [];

  for (var index = 0; index < this.barCount; index++) {
    barRedness.push(startRed + (index / this.barCount) * (endRed - startRed));
    barGreenness.push(startGreen + (index / this.barCount) * (endGreen - startGreen));
    barBlueness.push(startBlue + (index / this.barCount) * (endBlue - startBlue));
  }

  this.barBlockSprites = [];

  var currentY = 0;
  var rectangle = new PIXI.Graphics();

  for (index = 0; index < this.barCount; index++) {
    var barHeight = 10;
    var barRed = barRedness[index];
    var barGreen = barGreenness[index];
    var barBlue = barBlueness[index];

    var rectangle = new PIXI.Graphics();
    rectangle.beginFill(PIXI.utils.rgb2hex([barRed, barGreen, barBlue]));
    rectangle.drawRect(0, currentY, this.barWidth, barHeight);
    rectangle.endFill();
    barSprite.addChild(rectangle);

    this.barBlockSprites.push(rectangle);

    currentY += barHeight;
  }

  this.borderRectangle = new PIXI.Graphics();
  this.borderRectangle.lineStyle(4, 0x222222, 1);
  this.borderRectangle.drawRect(0, 0, this.barWidth, 150);
  barSprite.addChild(this.borderRectangle);

  this.totalBarHeight = currentY;

  this.sprite = barSprite;
}

LD39.ResourceBarEntity.prototype = Object.create(LD39.BarEntity.prototype);
LD39.ResourceBarEntity.prototype.constructor = LD39.ResourceBarEntity;

LD39.ResourceBarEntity.prototype.update = function(delta) {
  LD39.BarEntity.prototype.update.call(this, delta);
  for (var index = 0; index < this.barCount; index++) {
    var usedIndex = this.barCount - index - 1;
    var barFull = this.getProgress() >= 1.0;
    // var usedIndex = index;
    if ((this.flashing) && (barFull) && (!this.flashOn)) {
      this.barBlockSprites[index].visible = false;
    } else if (this.progressValue < this.barHeight * 0.2) {
      this.barBlockSprites[index].visible = false;
    } else if (this.progressValue > usedIndex * this.barHeight) {
      this.barBlockSprites[index].visible = true;
    } else {
      this.barBlockSprites[index].visible = false;
    }
  }

  if (this.flashing) {
    this.flashTimer += delta;

    if (this.flashTimer > this.flashRate) {
      if (this.flashOn) {
        this.flashOn = false;
      } else {
        this.flashOn = true;
      }

      this.flashTimer -= this.flashRate;
    }
  }
}
