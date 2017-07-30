var LD39 = LD39 || {};

LD39.Level01 = function(stage) {
  LD39.BaseLevel.call(this, stage);
}

LD39.Level01.prototype = Object.create(LD39.BaseLevel.prototype);
LD39.Level01.prototype.constructor = LD39.Level01;

LD39.Level01.prototype.createTrack = function() {
  LD39.BaseLevel.prototype.createTrack.call(this);

  this.track = new LD39.TrainTrack();

  this.track.addTrackPoint(400, 50, "ground", null);
  this.track.addTrackPoint(800, 120, "ground", null);
  this.track.addTrackPoint(800, 120, "ground", null);
  this.track.addTrackPoint(1300, 170, "ground", null);
  this.track.addTrackPoint(2000, 250, "ground", null);
  this.track.addTrackPoint(2400, 250, "bridge", null);
  this.track.addTrackPoint(2800, 150, "ground", null);
  this.track.addTrackPoint(3300, 0, "ground", "station");
  this.track.addTrackPoint(3600, 0, "ground", null);
}
