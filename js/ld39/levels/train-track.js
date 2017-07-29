var LD39 = LD39 || {};

LD39.TrainTrack = function() {
  this.points = [new PIXI.Point(0, 0)];
  this.currentPoints = null;
}

LD39.TrainTrack.prototype.addTrackPoint = function(x, y) {
  this.points.push(new PIXI.Point(x, y));
}

LD39.TrainTrack.prototype.getTrackPoints = function() {
  return this.points;
}

LD39.TrainTrack.prototype.getTrackPhysicsSpriteForPoints = function(startPoint, endPoint) {
  var padLength = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));

  var x = startPoint.x;
  var y = startPoint.y + 400;
  var width = padLength;
  var height = 20;

  var rotation = LD39.Utils.angleBetweenPoints(startPoint, endPoint);

  var rectangleSprite = new PIXI.Graphics();
  rectangleSprite.beginFill(0x66CCFF);
  rectangleSprite.lineStyle(4, 0xFF3300, 1);
  rectangleSprite.drawRect(x, y, width, height);
  rectangleSprite.rotation = rotation;
  rectangleSprite.endFill();

  return rectangleSprite;
}

LD39.TrainTrack.prototype.getTrackPhysicsBodyForPoints = function(startPoint, endPoint) {
  var padLength = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));

  var height = 20;

  var x = (endPoint.x + startPoint.x) / 2;
  var y = (endPoint.y + startPoint.y) / 2 + 400 + height / 2;
  var width = padLength;

  var rotation = LD39.Utils.angleBetweenPoints(startPoint, endPoint);
  
  var padPhysicsBody = Matter.Bodies.rectangle(x, y, width, height, {
     angle: rotation,
     isStatic: true
  });

  return padPhysicsBody;
}

LD39.TrainTrack.prototype.getTrackPhysicsObjects = function(sprites) {
  var pads = [];
  for (var index = 1; index < this.points.length; index++) {
    var startPoint = this.points[index - 1];
    var endPoint = this.points[index];

    if (sprites) {
      var padPhysicsBody = this.getTrackPhysicsSpriteForPoints(startPoint, endPoint);
      pads.push(padPhysicsBody);
    } else {
      var padPhysicsBody = this.getTrackPhysicsBodyForPoints(startPoint, endPoint);
      pads.push(padPhysicsBody);
    }
  }

  return pads;
}
