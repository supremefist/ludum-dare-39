var LD39 = LD39 || {};

LD39.TrainTrack = function() {
  this.points = [new PIXI.Point(-200, 0), new PIXI.Point(200, 0)];
  this.currentPoints = null;
}

LD39.TrainTrack.prototype.addTrackPoint = function(x, y) {
  this.points.push({
    type: "ground",
    x: x,
    y: y
  });
}

LD39.TrainTrack.prototype.addBridgePoint = function(x, y) {
  this.points.push({
    type: "strong-bridge",
    x: x,
    y: y
  });
}

LD39.TrainTrack.prototype.getLevelPoints = function() {
  return this.points;
}

LD39.TrainTrack.prototype.getTrackPhysicsSpriteForPoints = function(startPoint, endPoint, height) {
  var padLength = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));

  var x = startPoint.x;
  var y = startPoint.y;
  var width = padLength;

  var rotation = LD39.Utils.angleBetweenPoints(startPoint, endPoint);

  var rectangleGraphics = new PIXI.Graphics();
  rectangleGraphics.beginFill(0x66CCFF);
  rectangleGraphics.lineStyle(4, 0x1a1a1a, 1);
  rectangleGraphics.drawRect(0, 0, width, height);
  rectangleGraphics.endFill();

  var rectangleSprite = new PIXI.Container();
  rectangleSprite.addChild(rectangleGraphics);

  rectangleSprite.pivot.set(0.0, 0.5);
  rectangleSprite.rotation = rotation;

  rectangleSprite.position.set(x, y);

  return rectangleSprite;
}

LD39.TrainTrack.prototype.getTrackPhysicsBodyForPoints = function(startPoint, endPoint, height) {
  var padLength = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));

  var x = (endPoint.x + startPoint.x) / 2;
  var y = (endPoint.y + startPoint.y) / 2;
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
    var startPoint = Object.create(this.points[index - 1]);
    var endPoint = Object.create(this.points[index]);

    startPoint.y = startPoint.y;
    endPoint.y = endPoint.y;

    var height = 20;
    if (sprites) {
      var padPhysicsBody = this.getTrackPhysicsSpriteForPoints(startPoint, endPoint, height);
      pads.push(padPhysicsBody);
      // var padPhysicsBody = this.getTrackPhysicsSpriteForPoints(startPoint, new PIXI.Point(endPoint.x, startPoint.y), height);
      // pads.push(padPhysicsBody);
    } else {
      startPoint.y += height / 2;
      endPoint.y += height / 2;

      var padPhysicsBody = this.getTrackPhysicsBodyForPoints(startPoint, endPoint, height);
      pads.push(padPhysicsBody);
      // var padPhysicsBody = this.getTrackPhysicsBodyForPoints(startPoint, new PIXI.Point(endPoint.x, startPoint.y), height);
      // pads.push(padPhysicsBody);
    }
  }

  return pads;
}

LD39.TrainTrack.prototype.getSegmentsAtIndex = function(index) {
  if (index < 0) {
    return {
      "start": null,
      "end": this.points[0]
    }
  } else if (index >= this.points.length) {
    return {
      "start": this.points[this.points.length - 1],
      "end": null
    }
  } else {
    return {
      "start": this.points[index],
      "end": this.points[index + 1]
    }
  }
}
