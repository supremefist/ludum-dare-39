var LD39 = LD39 || {};

LD39.Level01 = function(stage) {
  LD39.BaseLevel.call(this, stage);

  this.levelTitle = "Level 1";
}

LD39.Level01.prototype = Object.create(LD39.BaseLevel.prototype);
LD39.Level01.prototype.constructor = LD39.Level01;

LD39.Level01.prototype.createTrack = function() {
  LD39.BaseLevel.prototype.createTrack.call(this);

  this.track = new LD39.TrainTrack();

  this.track.addTrackPoint(400, 50, "ground", null);
  this.track.addTrackPoint(400, -50, "ground", null);
  this.track.addTrackPoint(600, 20, "ground", null);
  this.track.addTrackPoint(300, 0, "ground", "factory");
  this.track.addTrackPoint(250, 0, "ground", "house");
  this.track.addTrackPoint(350, -90, "ground", null);
  this.track.addTrackPoint(400, -33, "ground", null);
  this.track.addTrackPoint(600, 0, "bridge", null);
  this.track.addTrackPoint(550, 100, "ground", null);
  this.track.addTrackPoint(400, -50, "ground", null);

  this.track.addTrackPoint(1000, -100, "ground", null);
  this.track.addTrackPoint(0, 400, "ground", null);
  this.track.addTrackPoint(200, 0, "hole", null);
  this.track.addTrackPoint(0, -200, "ground", null);

  this.track.addTrackPoint(700, 0, "ground", "house");
  this.track.addTrackPoint(900, -50, "ground", null);
  // this.track.addTrackPoint(800, 120, "ground", null);
  // this.track.addTrackPoint(1300, 170, "ground", null);
  // this.track.addTrackPoint(2000, 250, "ground", null);
  // this.track.addTrackPoint(2400, 250, "bridge", null);
  // this.track.addTrackPoint(2800, 150, "ground", null);
  // this.track.addTrackPoint(3300, 0, "ground", null);
  // this.track.addTrackPoint(1200, 0, "ground", null);
  this.track.addEnd();
}
