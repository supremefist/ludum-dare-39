var LD39 = LD39 || {};

LD39.Level01 = function(stage) {
  LD39.BaseLevel.call(this, stage);
}

LD39.Level01.prototype = Object.create(LD39.BaseLevel.prototype);
LD39.Level01.prototype.constructor = LD39.Level01;

LD39.Level01.prototype.createTrack = function() {
  LD39.BaseLevel.prototype.createTrack.call(this);

  this.track = new LD39.TrainTrack();

  this.track.addTrackPoint(400, 50);
  this.track.addTrackPoint(800, 120);
  this.track.addTrackPoint(1300, 170);
  this.track.addTrackPoint(2000, 250);
}
