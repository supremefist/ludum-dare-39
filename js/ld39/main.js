var LD39 = LD39 || {};

LD39.renderer = null;
LD39.lastUpdateTimestamp = null;

LD39.loadingScreen = null;
LD39.currentScreen = null;

LD39.renderCurrentScreen = function() {
  if (LD39.currentScreen == null) {
    return;
  }

  LD39.currentScreen.render(LD39.renderer);
}

LD39.updateCurrentScreen = function(delta) {
  LD39.currentScreen.update(delta);
}

LD39.initializeRenderer = function() {
  var type = "WebGL"
  if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
  }

  PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

  //Create the renderer
  LD39.renderer = PIXI.autoDetectRenderer(800, 600, {
    antialias: false,
    transparent: false,
    resolution: 1
  });
}

LD39.loadProgressHandler = function(loader, resource) {
  LD39.loadingScreen.loadProgressHandler(loader.progress);
}

LD39.loadingCompleted = function(loader, resources) {
  LD39.setCurrentScreen(new LD39.TrainRideScreen());
}

LD39.loadResources = function() {
  var message = new PIXI.Text(
    "Loading...", {
      font: "64px Futura",
      fill: "white"
    }
  );

  PIXI.loader
    .add('graphics/train', 'resources/graphics/train.png')
    .add('graphics/buildings', 'resources/graphics/buildings.png')
    .add('sounds/bump_b', 'resources/sounds/bump_b.wav')
    .add('sounds/bump_c', 'resources/sounds/bump_c.wav')
    // .add('music/main', 'resources/music/the_jaunt.mp3')
    .load(LD39.loadingCompleted);

  PIXI.loader.on("progress", LD39.loadProgressHandler);
}

LD39.initializeGame = function() {
  LD39.stage = new PIXI.Container();

  //Create a container object called the `stage`
  LD39.loadingScreen = new LD39.LoadingScreen();
  LD39.setCurrentScreen(LD39.loadingScreen);

  LD39.loadResources();
  LD39.startGameLoop();
}

LD39.setCurrentScreen = function(screen) {
  if (LD39.currentScreen != null) {
    LD39.currentScreen.terminate();
  }

  screen.initialize();
  LD39.currentScreen = screen;
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

  LD39.updateCurrentScreen(delta);
  LD39.renderCurrentScreen();

  LD39.lastUpdateTimestamp = timestamp;
}
