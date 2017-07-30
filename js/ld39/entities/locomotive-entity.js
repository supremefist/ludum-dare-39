var LD39 = LD39 || {};

LD39.LocomotiveEntity = function() {
  LD39.Entity.call(this);

  var texture = PIXI.loader.resources["graphics/train"].texture;
  var trainTexture = new PIXI.Texture(
    texture, new PIXI.Rectangle(1, 1, 64, 26));

  var trainSprite = new PIXI.Container();

  var coalBurnTime = 0;
  var steamBurnTime = 0;
  this.currentParameters = {
    "coal": 1.0,
    "burningCoal": 0.0,
    "steam": 0.0,
    "throttle": 0.3
  };

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

  this.processResources(delta);
}

LD39.LocomotiveEntity.prototype.processResources = function(delta) {
  var baseDuration = 10000;

  var burnToSteamRatio = 0.1;
  var steamToEngineRatio = 2;

  var fullBurningDuration = baseDuration * 15;
  var fullSteamGenerationDuration = fullBurningDuration * burnToSteamRatio;
  var fullSteamUseDuration = fullSteamGenerationDuration * steamToEngineRatio;

  // console.log("Starting steam: " + this.currentParameters.steam);
  var burnAmount = delta / fullBurningDuration;

  if (this.currentParameters['burningCoal'] >= burnAmount) {
    this.currentParameters['burningCoal'] -= burnAmount;
    var generatedSteamAmount = delta / fullSteamGenerationDuration;
    this.currentParameters['steam'] += generatedSteamAmount;

    // console.log("Generated " + generatedSteamAmount.toFixed(10) + " steam!");
  }

  // console.log("Steam after generation: " + this.currentParameters.steam);

  var throttleMultiplier = 0.02;
  var idleValue = 0.3;

  var finalTorque = 0;
  var throttleValue = this.currentParameters['throttle'];

  var finalSteamConsumption = 0;
  if (this.currentParameters['steam'] > 0.05) {
    var steamConsumptionAmount = delta / fullSteamUseDuration;

    var sliderConstant = 0.2;
    var torqueConstant = 1.0;
    var finalSteamConsumption = 0;

    if (throttleValue > idleValue) {
      // Try to burn forward
      var forwardMultiplier = (throttleValue - idleValue) / sliderConstant;
      var maxForwardMultiplier = Math.min(3, Math.floor(this.currentParameters['steam'] / steamConsumptionAmount));

      forwardMultiplier = Math.min(forwardMultiplier, maxForwardMultiplier);

      // console.log("Final forward multiplier: " + forwardMultiplier);
      finalSteamConsumption = steamConsumptionAmount * forwardMultiplier;
      this.currentParameters['steam'] -= finalSteamConsumption;
      finalTorque = throttleMultiplier * forwardMultiplier * sliderConstant * torqueConstant;
    } else if (throttleValue < idleValue) {
      // Try to burn backward
      var backwardMultiplier = (idleValue - throttleValue) / sliderConstant;
      var maxBackwardMultiplier = Math.min(1, Math.floor(this.currentParameters['steam'] / steamConsumptionAmount));

      backwardMultiplier = Math.min(backwardMultiplier, maxBackwardMultiplier);

      finalSteamConsumption = steamConsumptionAmount * backwardMultiplier;
      this.currentParameters['steam'] -= finalSteamConsumption;
      finalTorque = throttleMultiplier * backwardMultiplier * sliderConstant * torqueConstant;
    }
  }

  // console.log("Consumed " + finalSteamConsumption.toFixed(10) + " steam!");

  this.physicsBody.bodies[1].torque = finalTorque;
  this.physicsBody.bodies[2].torque = finalTorque;
  // console.log(this.currentParameters['steam'] + ": " + finalTorque);
}

LD39.LocomotiveEntity.prototype.setPhysicsPosition = function(x, y) {
  // Matter.Body.setPosition(this.physicsBody, new PIXI.Point(x, y));
  Matter.Composite.translate(this.physicsBody, new PIXI.Point(x, y));

  // Matter.Body.setPosition(this.physicsBody, new PIXI.Point(x, y));
  // this.physicsBody.state.pos.x = x;
  // this.physicsBody.y = y;
}

LD39.LocomotiveEntity.prototype.setThrottle = function(throttleValue) {
  this.currentParameters['throttle'] = throttleValue;
}

LD39.LocomotiveEntity.prototype.setPosition = function(x, y) {
  LD39.Entity.prototype.setPosition.call(this, x, y);

  // Matter.Body.setPosition(this.physicsBody, new PIXI.Point(x, y));
  // this.physicsBody.state.pos.x = x;
  // this.physicsBody.y = y;
}

LD39.LocomotiveEntity.prototype.setStatic = function(isStatic) {
  for (var index = 0; index < this.physicsBody.bodies.length; index++) {
    if (isStatic) {
      Matter.Body.setInertia(this.physicsBody.bodies[index], Infinity);
    } else {
      Matter.Body.setInertia(this.physicsBody.bodies[index], 550);
    }

    // console.log(this.physicsBody.bodies[index].inertia);

    // Matter.Body.setStatic(this.physicsBody.bodies[index], isStatic);
  }
}

LD39.LocomotiveEntity.prototype.accelerate = function() {
  if (this.currentParameters['throttle'] + 0.2 > 1.0) {
    return;
  }

  this.currentParameters['throttle'] += 0.2;
}

LD39.LocomotiveEntity.prototype.decelerate = function() {
  if (this.currentParameters['throttle'] - 0.2 < 0.0) {
    return;
  }

  this.currentParameters['throttle'] -= 0.2;
}

LD39.LocomotiveEntity.prototype.feedCoal = function() {

  var coalConsumption = 0.1;
  var burningCoalIncrement = 0.25;

  if (this.currentParameters['coal'] < coalConsumption) {
    console.log("Not enough coal");
    return;
  }

  if (this.currentParameters['burningCoal'] + burningCoalIncrement > 1.0) {
    console.log("No burning space");
    return;
  }

  this.currentParameters['coal'] -= coalConsumption;
  this.currentParameters['burningCoal'] += burningCoalIncrement;
}
