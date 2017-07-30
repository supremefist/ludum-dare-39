var LD39 = LD39 || {};

LD39.TrainTrack = function() {
  this.points = [];
  this.currentPoints = null;

  this.addStart();
}

LD39.TrainTrack.prototype.addStart = function() {
  this.points = [{
    x: -400,
    y: -200,
    type: "ground",
    building: null
  }];

  this.addTrackPoint(200, 0, "ground", null);
  this.addTrackPoint(0, 200, "ground", null);
  this.addTrackPoint(400, 0, "ground", "station");
}

LD39.TrainTrack.prototype.addEnd = function() {
  this.addTrackPoint(800, 0, "ground", "station");
  this.addTrackPoint(0, -200, "ground", null);
  this.addTrackPoint(800, -400, "ground", null);

}

LD39.TrainTrack.prototype.addTrackPoint = function(deltaX, deltaY, type, building) {
  var previousPoint = this.points[this.points.length - 1];

  this.points.push({
    type: type,
    building: building,
    x: previousPoint.x + deltaX,
    y: previousPoint.y + deltaY
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

LD39.TrainTrack.prototype.getBuildingLocations = function() {
  var locations = [];
  for (var index = 0; index < this.points.length - 1; index++) {
    var segments = this.getSegmentsAtIndex(index);

    if (segments.end.building != null) {
      var buildingBaseX = (segments.start.x + segments.end.x) / 2.0;
      var buildingBaseY = (segments.start.y + segments.end.y) / 2.0;

      locations.push({
        type: segments.end.building,
        x: buildingBaseX,
        y: buildingBaseY
      });
    }
  }

  return locations;
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

LD39.TrainTrack.prototype.getBoundingRectangle = function() {
  var minX = Infinity;
  var maxX = 0;

  var minY = Infinity;
  var maxY = 0;

  for (var index = 0; index < this.points.length; index++) {
    minX = Math.min(this.points[index].x, minX);
    maxX = Math.max(this.points[index].x, maxX);
    minY = Math.min(this.points[index].y, minY);
    maxY = Math.max(this.points[index].y, maxY);
  }

  return new PIXI.Rectangle(minX, minY, maxX - minX, maxY - minY);
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
