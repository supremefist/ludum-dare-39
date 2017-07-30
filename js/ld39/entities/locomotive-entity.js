var LD39 = LD39 || {};

LD39.LocomotiveEntity = function() {
  LD39.Entity.call(this);

  var texture = PIXI.loader.resources["graphics/train"].texture;
  var trainTexture = new PIXI.Texture(
    texture, new PIXI.Rectangle(1, 1, 64, 26));

  var trainSprite = new PIXI.Container();

  this.baseBurnCycleTime = 500;
  this.burnCycleTimeVariance = 0.8;
  this.burnCycleTime = this.baseBurnCycleTime;

  this.baseEngineCycleTime = 0;
  this.engineSoundCycleTime = 0;
  this.useAlternateSound = true;

  this.baseAlarmCycleTime = 1000;
  this.alarmCycleTime = 0;

  var coalBurnTime = 0;
  var steamBurnTime = 0;
  this.currentParameters = {
    "coal": 1.0,
    "burningCoal": 0.0,
    "steam": 0.0,
    "throttle": 0.3,
    "effectiveThrottle": 0.3,
    "changes": {
      'coal': 0,
      'burningCoal': 0,
      'steam': 0
    }
  };

  this.braking = false;
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

  this.chimneyBox = new PIXI.Container();
  this.chimneyBox.position.set(15, -35);
  trainSprite.addChild(this.chimneyBox);

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

  this.smokeFactory = new LD39.SmokeFactory();
  this.effectiveThrottleBuffer = [];
}

LD39.LocomotiveEntity.prototype = Object.create(LD39.Entity.prototype);
LD39.LocomotiveEntity.prototype.constructor = LD39.LocomotiveEntity;

LD39.LocomotiveEntity.prototype.addToStage = function(stage) {
  stage.addChild(this.sprite);
  stage.addChild(this.smokeFactory.stage);
}

LD39.LocomotiveEntity.prototype.isStationary = function() {
  var xMovement = Math.abs(this.physicsBody.bodies[0].velocity.x) > 0.1;
  var yMovement = Math.abs(this.physicsBody.bodies[0].velocity.y) > 0.1;

  return !xMovement && !yMovement;
}


LD39.LocomotiveEntity.prototype.update = function(delta) {
  LD39.Entity.prototype.update.call(this, delta);

  // this.setPosition(this.physicsBody.position.x, this.physicsBody.position.y);
  // this.setRotation(this.physicsBody.angle);

  this.setPosition(this.physicsBody.bodies[0].position.x, this.physicsBody.bodies[0].position.y);
  this.setRotation(this.physicsBody.bodies[0].angle);

  this.processResources(delta);
  // var position = this.chimneyBox.position;
  var position = this.getPosition();

  this.smokeFactory.setSmokePosition(position.x + 15, position.y - 15);
  // this.smokeFactory.setSmokePosition(400, -200);
  this.smokeFactory.update(delta);

  this.playCurrentEngineSound(delta);
  if (this.currentParameters.steam > 1.0) {
    this.playAlarmSound(delta);
  } else {
    this.alarmCycleTime = 0;
  }
}

LD39.LocomotiveEntity.prototype.playCurrentEngineSound = function(delta) {
  if (this.baseEngineCycleTime > 0) {
    this.engineSoundCycleTime -= delta;

    if (this.engineSoundCycleTime < 0) {
      if (this.useAlternateSound) {
        PIXI.loader.resources['sounds/engine_a'].sound.play();
        this.useAlternateSound = false;
      } else {
        PIXI.loader.resources['sounds/engine_b'].sound.play();
        this.useAlternateSound = true;
      }

      this.engineSoundCycleTime = this.baseEngineCycleTime;
    }
  }
}

LD39.LocomotiveEntity.prototype.playBurnSound = function(delta) {
  if (this.burnCycleTime > 0) {
    this.burnCycleTime -= delta

    if (this.burnCycleTime < 0) {
      var playedSound = Math.floor(Math.random() * 3);
      var burnSound = null;
      if (playedSound == 0) {
        burnSound = PIXI.loader.resources['sounds/burn_a'].sound;
      } else if (playedSound == 1) {
        burnSound = PIXI.loader.resources['sounds/burn_b'].sound;
      } else {
        burnSound = PIXI.loader.resources['sounds/burn_b'].sound;
      }

      burnSound.volume = 0.2;
      burnSound.play();

      this.burnCycleTime = this.baseBurnCycleTime * (1.0 + (Math.random() - 0.5) * this.burnCycleTimeVariance);
    }
  } else {
    this.burnCycleTime = this.baseBurnCycleTime;
  }
}

LD39.LocomotiveEntity.prototype.playAlarmSound = function(delta) {
  if (this.alarmCycleTime >= 0) {
    this.alarmCycleTime -= delta;

    if (this.alarmCycleTime <= 0) {
      PIXI.loader.resources['sounds/alarm'].sound.play();
    }
  } else {
    this.alarmCycleTime = this.baseAlarmCycleTime;
  }
}


LD39.LocomotiveEntity.prototype.processResources = function(delta) {
  var baseDuration = 50000;

  var burnToSteamRatio = 0.15;
  var steamToEngineRatio = 2;

  var fullBurningDuration = baseDuration;
  var fullSteamGenerationDuration = fullBurningDuration * burnToSteamRatio;
  var fullSteamUseDuration = fullSteamGenerationDuration * steamToEngineRatio;

  // console.log("Starting steam: " + this.currentParameters.steam);
  var burnAmount = delta / fullBurningDuration;

  if (this.currentParameters['burningCoal'] >= burnAmount) {
    this.playBurnSound(delta);
    this.currentParameters['burningCoal'] -= burnAmount;
    this.currentParameters.changes['burningCoal'] -= burnAmount;

    var generatedSteamAmount = delta / fullSteamGenerationDuration;
    if (generatedSteamAmount > 0) {
      this.currentParameters['steam'] += generatedSteamAmount;
      this.currentParameters.changes['steam'] += generatedSteamAmount;
    }
    // console.log("Generated " + generatedSteamAmount.toFixed(10) + " steam!");
    // console.log(this.currentParameters['steam']);
  }

  // console.log("Steam after generation: " + this.currentParameters.steam);

  var throttleMultiplier = 0.02;
  var idleValue = 0.3;

  var finalTorque = 0;
  var throttleValue = this.currentParameters.throttle;

  var finalSteamConsumption = 0;
  var movementMultiplier = 0;
  var effectiveThrottle = idleValue;

  var steamConsumptionAmount = delta / fullSteamUseDuration;

  var sliderConstant = 0.2;
  var torqueConstant = 2;
  var finalSteamConsumption = 0;

  var maxMovementMultiplier = 0;
  if (this.currentParameters.steam > 0.4) {
    maxMovementMultiplier = 3;
  } else if (this.currentParameters.steam > 0.2) {
    maxMovementMultiplier = 2;
  } else if (this.currentParameters.steam > 0) {
    maxMovementMultiplier = 1;
  }

  if (throttleValue > idleValue) {
    // Try to burn forward
    movementMultiplier = (throttleValue - idleValue) / sliderConstant;
    movementMultiplier = Math.min(movementMultiplier, maxMovementMultiplier);

    // console.log("Final forward multiplier: " + movementMultiplier);
    effectiveThrottle = (movementMultiplier * sliderConstant) + idleValue;

    finalSteamConsumption = steamConsumptionAmount * movementMultiplier;

    finalTorque = throttleMultiplier * movementMultiplier * sliderConstant * torqueConstant;
  } else if (throttleValue < idleValue) {
    // Try to burn backward
    maxMovementMultiplier = Math.min(1, maxMovementMultiplier);
    movementMultiplier = (idleValue - throttleValue) / sliderConstant;
    movementMultiplier = Math.min(movementMultiplier, maxMovementMultiplier);

    effectiveThrottle = idleValue - (movementMultiplier * sliderConstant);
    finalSteamConsumption = steamConsumptionAmount * movementMultiplier;
    finalTorque = -1.0 * throttleMultiplier * movementMultiplier * sliderConstant * torqueConstant;
  }

  movementMultiplier = Math.round(movementMultiplier);

  if (movementMultiplier == 0) {
    this.baseEngineCycleTime = 0;
  } else if (movementMultiplier == 1) {
    this.baseEngineCycleTime = 400;
    finalSteamConsumption *= 0.7;
  } else if (movementMultiplier == 2) {
    this.baseEngineCycleTime = 300;
    finalSteamConsumption *= 1.1;
  } else if (movementMultiplier == 3) {
    this.baseEngineCycleTime = 200;
    finalSteamConsumption *= 1.5;
  }

  if (finalSteamConsumption > 0) {
    this.currentParameters['steam'] -= finalSteamConsumption;
    this.currentParameters.changes['steam'] -= finalSteamConsumption;
  }

  this.effectiveThrottleBuffer.push(effectiveThrottle);

  var bufferSize = 50;
  if (this.effectiveThrottleBuffer.length > bufferSize) {
    this.effectiveThrottleBuffer = this.effectiveThrottleBuffer.slice(this.effectiveThrottleBuffer.length - bufferSize, this.effectiveThrottleBuffer.length);
  }

  var totalEffectiveThrottle = 0;
  var effectiveThrottleCount = 0;
  for (var index = 0; index < this.effectiveThrottleBuffer.length; index++) {
    totalEffectiveThrottle += this.effectiveThrottleBuffer[index];
    effectiveThrottleCount += 1;
  }

  this.currentParameters['effectiveThrottle'] = totalEffectiveThrottle / effectiveThrottleCount;
  this.smokeFactory.updateSmokeOutput(movementMultiplier);

  // console.log("Consumed " + finalSteamConsumption.toFixed(10) + " steam!");

  if (this.braking) {
    if (!this.isStationary()) {
      // Active braking
      var brakeTorque = 0.0025;

      if (this.physicsBody.bodies[0].velocity.x < 0) {
        this.physicsBody.bodies[1].torque = brakeTorque;
        this.physicsBody.bodies[2].torque = brakeTorque;
      } else {
        this.physicsBody.bodies[1].torque = -brakeTorque;
        this.physicsBody.bodies[2].torque = -brakeTorque;
      }
    } else {
      this.physicsBody.bodies[1].torque = 0;
      this.physicsBody.bodies[2].torque = 0;
    }

  } else {
    this.physicsBody.bodies[1].torque = finalTorque;
    this.physicsBody.bodies[2].torque = finalTorque;
  }

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

  var coalConsumption = 0.2;
  var burningCoalIncrement = 0.25;

  if (this.currentParameters['coal'] < coalConsumption) {
    // console.log("Not enough coal");
    return;
  }

  if (this.currentParameters['burningCoal'] + burningCoalIncrement > 1.0) {
    // console.log("No burning space");
    return;
  }

  this.currentParameters['coal'] -= coalConsumption;
  this.currentParameters.changes['coal'] = -coalConsumption

  this.currentParameters['burningCoal'] += burningCoalIncrement;
  this.currentParameters.changes['burningCoal'] = burningCoalIncrement
}

LD39.LocomotiveEntity.prototype.applyBrakes = function() {
  this.braking = true;
}

LD39.LocomotiveEntity.prototype.releaseBrakes = function() {
  this.braking = false;
}
