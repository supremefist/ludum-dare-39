var LD39 = LD39 || {};

LD39.LocomotiveEntity = function() {
  LD39.Entity.call(this);

  var texture = PIXI.loader.resources["graphics/train"].texture;
  var trainTexture = new PIXI.Texture(
    texture, new PIXI.Rectangle(1, 1, 64, 26));

  var trainSprite = new PIXI.Container();

  this.wheelSprites = [];
  var wheelOffsets = [-24, -12, 0, 20];
  // var wheelOffsets = [];
  for (var index = 0; index < wheelOffsets.length; index++) {
    var wheelSprite = new PIXI.Graphics();
    wheelSprite.beginFill(0x000000);
    wheelSprite.drawCircle(0, 0, 6);
    wheelSprite.endFill();
    wheelSprite.x = wheelOffsets[index];
    wheelSprite.y = 11;
    this.wheelSprites.push(wheelSprite);
    trainSprite.addChild(wheelSprite);
  }

  var bodySprite = new PIXI.Sprite(trainTexture);
  bodySprite.position.set(0, 0);
  bodySprite.anchor.set(0.5, 0.5);
  trainSprite.addChild(bodySprite);

  // this.physicsBody = Matter.Bodies.rectangle(0, 0, 64, 32);
  // this.physicsBody = Matter.Composites.car(0, 0, 64, 32, 6);
  // this.physicsBody = Matter.Composites.car(150, 100, 150 * scale, 30 * scale, 30 * scale);
  this.physicsBody = LD39.createTrainComposite(0, 0, 64, 32, 18);
  // this.physicsBody = Matter.Composites.car(64, 32, 64, 32, 24);
  // Matter.Body.applyForce(this.physicsBody.bodies[0], new PIXI.Point(0, 0), new PIXI.Point(0.05, 0));
  this.setSprite(trainSprite);
}

LD39.LocomotiveEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.LocomotiveEntity.prototype.constructor = LD39.LocomotiveEntity;

LD39.LocomotiveEntity.prototype.update = function(delta) {
  LD39.Entity.prototype.update.call(this, delta);

  // this.setPosition(this.physicsBody.position.x, this.physicsBody.position.y);
  // this.setRotation(this.physicsBody.angle);

  this.setPosition(this.physicsBody.bodies[0].position.x, this.physicsBody.bodies[0].position.y);
  this.setRotation(this.physicsBody.bodies[0].angle);
}

LD39.LocomotiveEntity.prototype.getWheelPositions = function() {
  var locomotiveBounds = this.sprite.getBounds();

  var backPosition = this.wheelSprites[0].getGlobalPosition();
  var frontPosition = this.wheelSprites[3].getGlobalPosition();
  return {
    "back": backPosition,
    "front": frontPosition,
  }
}

LD39.LocomotiveEntity.prototype.setPhysicsPosition = function(x, y) {
  // Matter.Body.setPosition(this.physicsBody, new PIXI.Point(x, y));
  Matter.Composite.translate(this.physicsBody, new PIXI.Point(x, y));

  // Matter.Body.setPosition(this.physicsBody, new PIXI.Point(x, y));
  // this.physicsBody.state.pos.x = x;
  // this.physicsBody.y = y;
}

LD39.LocomotiveEntity.prototype.setPosition = function(x, y) {
  LD39.Entity.prototype.setPosition.call(this, x, y);

  // Matter.Body.setPosition(this.physicsBody, new PIXI.Point(x, y));
  // this.physicsBody.state.pos.x = x;
  // this.physicsBody.y = y;
}
