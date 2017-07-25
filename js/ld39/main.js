var LD39 = LD39 || {};

LD39.stage = null;
LD39.renderer = null;
LD39.lastUpdateTimestamp = null;

LD39.loadingScene = null;
LD39.mainScene = null;
LD39.pacmanSprite = null;

LD39.renderCurrentStage = function() {
  LD39.renderer.render(LD39.stage);
}

LD39.updateCurrentStage = function(delta) {
  if (LD39.pacmanSprite != null) {
    LD39.pacmanSprite.x += LD39.pacmanSprite.vx * (delta / 1000.0);
    LD39.pacmanSprite.y += LD39.pacmanSprite.vy * (delta / 1000.0);
  }
}

LD39.initializeRenderer = function() {
  var type = "WebGL"
  if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
  }

  //Create the renderer
  LD39.renderer = PIXI.autoDetectRenderer(800, 600, {
    antialias: false,
    transparent: false,
    resolution: 1
  });
}

LD39.loadingCompleted = function(loader, resources) {
  LD39.initializeMainContent();

  LD39.loadingScene.visible = false;
  LD39.mainScene.visible = true;
}

LD39.loadProgressHandler = function(loader, resource) {
  console.log("loading " + loader.progress);
}

LD39.loadResources = function() {
  var message = new PIXI.Text(
    "Loading...",
    {font: "64px Futura", fill: "white"}
  );

  PIXI.loader
    .add('graphics/pacman', 'resources/graphics/pacman.png')
    .add('music/main', 'resources/music/the_jaunt.mp3')
    .load(LD39.loadingCompleted);

  PIXI.loader.on("progress", LD39.loadProgressHandler);
}

LD39.initializeGame = function() {
  LD39.stage = new PIXI.Container();

  //Create a container object called the `stage`
  LD39.loadingScene = new PIXI.Container();

  var message = new PIXI.Text(
    "Loading...",
    {fontFamily: "Arial", fontSize: 32, fill: "white"}
  );

  message.position.set(54, 96);

  LD39.loadingScene.addChild(message);
  LD39.stage.addChild(LD39.loadingScene);

  LD39.loadResources();
  LD39.startGameLoop();
}

LD39.initializeMainContent = function() {
  LD39.initializeKeyboard();
  LD39.startMusic();

  LD39.mainScene = new PIXI.Container();
  var texture = PIXI.loader.resources["graphics/pacman"].texture;

  var pacmanTexture = new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 32, 32));
  var pacmanSprite = new PIXI.Sprite(pacmanTexture);
  pacmanSprite.x = 300;
  pacmanSprite.y = 300;
  pacmanSprite.vx = 0;
  pacmanSprite.vy = 0;
  LD39.pacmanSprite = pacmanSprite;
  LD39.mainScene.addChild(pacmanSprite);

  var ghostTexture = new PIXI.Texture(texture, new PIXI.Rectangle(32, 0, 32, 32));
  var ghostSprite = new PIXI.Sprite(ghostTexture);
  ghostSprite.x = 500;
  ghostSprite.y = 300;
  LD39.mainScene.addChild(ghostSprite);

  LD39.stage.addChild(LD39.mainScene);
}

LD39.startMusic = function() {
  PIXI.loader.resources['music/main'].sound.play();
}

LD39.startGameLoop = function() {
  window.requestAnimationFrame(LD39.gameLoop);
}

LD39.gameLoop = function(timestamp) {
  if (LD39.lastUpdateTimestamp == null) {
    LD39.lastUpdateTimestamp = timestamp;
  }

  window.requestAnimationFrame(LD39.gameLoop);

  var delta = timestamp - LD39.lastUpdateTimestamp;
  LD39.updateCurrentStage(delta);
  LD39.renderCurrentStage();

  LD39.lastUpdateTimestamp = timestamp;
}

LD39.initializeKeyboard = function() {
  var left = LD39.keyboard(37);
  var up = LD39.keyboard(38);
  var right = LD39.keyboard(39);
  var down = LD39.keyboard(40);

  var coreSpeed = 150;
  up.press = function() {
    LD39.pacmanSprite.vy = -coreSpeed;
  };
  up.release = function() {
    LD39.pacmanSprite.vy = 0;
  }

  down.press = function() {
    LD39.pacmanSprite.vy = coreSpeed;
  };
  down.release = function() {
    LD39.pacmanSprite.vy = 0;
  }

  left.press = function() {
    LD39.pacmanSprite.vx = -coreSpeed;
  };
  left.release = function() {
    LD39.pacmanSprite.vx = 0;
  }

  right.press = function() {
    LD39.pacmanSprite.vx = coreSpeed;
  };
  right.release = function() {
    LD39.pacmanSprite.vx = 0;
  }
}

LD39.keyboard = function(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    // event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    // event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
