var LD39 = LD39 || {};

LD39.Utils = function() {

};

LD39.Utils.angleBetweenPoints = function(pointA, pointB) {
  return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
}
