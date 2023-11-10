function getSceneById(id) {
  let url = "methods/getScene.php?id="+id;
  fetch(url, {method:"GET"})
    .then((response) => {
      //before parsing (i.e. decoding) the JSON data
      if (!response.ok) {
        //check for any errors
        //in case of an error, throw.
        throw new Error("something went wrong!");
      }
      let parsedResponse = response.json();
      return parsedResponse; //parse the json data
    })
    .then((data) => {
      //this is where you handle what to do with the response
      // console.log(data);
      fairy = data[0];
      fairyPlayground = data[1];


      return data;
    })
    .catch((error) => {
      //this is where handle errors
    });
}
getSceneById();

function getElementById(id) {
  let url = "methods/getElement.php?id="+id;
  fetch(url, {method:"GET"})
    .then((response) => {
      //before parsing (i.e. decoding) the JSON data
      if (!response.ok) {
        //check for any errors
        //in case of an error, throw.
        throw new Error("something went wrong!");
      }
      let parsedResponse = response.json();
      return parsedResponse; //parse the json data
    })
    .then((data) => {
      //this is where you handle what to do with the response
      // console.log(data);
      coin = data[0];
      steel = data[1];
      portal = data[2];

      return data;
    })
    .catch((error) => {
      //this is where handle errors
    });
}
getElementById();

function getGhostById(id) {
  let url = "methods/getGhost.php?id="+id;
  fetch(url, {method:"GET"})
    .then((response) => {
      //before parsing (i.e. decoding) the JSON data
      if (!response.ok) {
        //check for any errors
        //in case of an error, throw.
        throw new Error("something went wrong!");
      }
      let parsedResponse = response.json();
      return parsedResponse; //parse the json data
    })
    .then((data) => {
      //this is where you handle what to do with the response
      // console.log(data);
      ghostData = data[0];
      ghostyData = data[1];
      gameOver = data[2];

      return data;
    })
    .catch((error) => {
      //this is where handle errors
    });
}
getGhostById();

function getPlayersById(id) {
  let url = "methods/getPlayers.php?id="+id;
  fetch(url, {method:"GET"})
    .then((response) => {
      //before parsing (i.e. decoding) the JSON data
      if (!response.ok) {
        //check for any errors
        //in case of an error, throw.
        throw new Error("something went wrong!");
      }
      let parsedResponse = response.json();
      return parsedResponse; //parse the json data
    })
    .then((data) => {
      //this is where you handle what to do with the response
      // console.log(data);
      players = data[0];

      return data;
    })
    .catch((error) => {
      //this is where handle errors
    });
}
getPlayersById();


kaboom({
  scale: 1,
  background: [228, 182, 251],
});

loadSprite("steel", "sprites/brickCube.png");
loadSprite("ghost", "sprites/ghost-1.png");
loadSprite("ghosty", "sprites/ghost-2.png");
loadSprite("gameOver", "sprites/game-over.png");
loadSprite("portal", "sprites/portal.png");
loadSprite("winner", "sprites/win.png");
loadSprite("coin", "sprites/coin.png");
loadSprite("fairy", "sprites/background.png");
loadSprite("fairy-playground", "sprites/background2.png");
loadSprite("player", "sprites/pac-open-close.png", 
{
  sliceX: 2, 
  anims: {
    open: {
      from: 0,
      to: 0,
    },
    close: {
      from: 1,
      to: 1, 
    },
  },
}
);



/**
 * Start scene
 */

scene("start", () => {
  add([
    // list of components
    sprite("fairy"),
    scale(0.77),
    pos(0, 0),

  ]);

  add([
    text("Welcome to the Maze"),
    pos(width() / 2, height() / 6),
    scale(2),
    anchor("center"),
  ]);

  function addButton(txt, p, f) {
    // add a parent background object
    const btn = add([
      rect(240, 80, { radius: 8 }),
      pos(width() / 2, height() / 2 - 108),
      area(),
      scale(1),
      anchor("center"),
      outline(4),
    ]);

    // add a child object that displays the text
    btn.add([text(txt), anchor("center"), color(0, 0, 0)]);

    // onHoverUpdate() comes from area() component
    // it runs every frame when the object is being hovered
    btn.onHoverUpdate(() => {
      const t = time() * 10;
      btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
      btn.scale = vec2(1.2);
      setCursor("pointer");
    });

    // onHoverEnd() comes from area() component
    // it runs once when the object stopped being hovered
    btn.onHoverEnd(() => {
      btn.scale = vec2(1);
      btn.color = rgb();
    });

    // onClick() comes from area() component
    // it runs once when the object is clicked
    btn.onClick(f);

    return btn;
  }

  // add button
  addButton("Start", vec2(200, 100), () => go("game"));
});

/**
 * main game scene content
 */

scene("game",  ({ levelId, coins, score } = { levelId: 0, coins: 0 , score: 0 }) => {
  add([
    // list of components
    sprite(fairyPlayground.name),
    scale(fairyPlayground.scale),
    pos(0, 0),

  ]);
  const TILE_WIDTH = 64;
  const TILE_HEIGHT = 64;

  /**
   *  Creates a maze level.
   */

  const LEVELS = [
    [
      // Design the level layout with symbols
      "= ======= === ======",
      "=$=$===$$$===$$$$===",
      "=$=$===$========$===",
      "=$$$  $$========$$$ ",
      "==$====$==$$$$==$===",
      "==$====$==$==$   ===",
      "=$$====$$$$==$$$$$>=",
      "====== = ====== ====",
    ],
    [
      // Design the level layout with symbols
      "======== ===========",
      "   $=$$$ ===$$$$====",
      "===$======== == ====",
      "===$====  >===$$$=$=",
      "  =$   = ===== = =$=",
      "=$=$== =$$$$$$$= = =",
      "=$=$== ========= =  ",
      "===$ =$$$$$$$$$$$===",
      "====================",
    ],

  ];

  const levelConf = {
      tileWidth: TILE_WIDTH,  
      tileHeight: TILE_WIDTH,
      pos: vec2(100, 200),
      tiles: {
        "=": () => [sprite(steel.name), area(), body({ isStatic: true })],
        ">": () => [sprite(portal.name), area(), scale(0.1), portal.name],
        "$": () => [sprite(coin.name), area(), scale(0.07), coin.name],
      },
    };
  /**
   * Character spawning
   */
	const level = addLevel(LEVELS[levelId ?? 0], levelConf)

  const player = add([
    // list of components
    sprite(players.name),
    scale(0.15),
    pos(80, 40),
    area(),
    body(),
  ]);

  // player.play("open", { loop: true, speed: 0.1 });
  // player.play("close", { loop: true, speed: 0.1 });

  for (let i = 0; i < 2; i++) {
    // generate a random point on screen
    // width() and height() gives the game dimension
    const x = rand(0, width());
    const y = rand(0, height());

    const enemy = add([
      sprite(ghostyData.name),
      pos(x, y),
      scale(0.1),
      anchor("center"),
      area(),
      state("move"),
      "enemy",
    ]);

    // Like .onUpdate() which runs every frame, but only runs when the current state is "move"
    // Here we move towards the player every frame if the current state is "move"
    enemy.onStateUpdate("move", () => {
      if (!player.exists()) return;
      const dir = player.pos.sub(enemy.pos).unit();
      enemy.move(dir.scale(ghostyData.speed));
    });

    player.onCollide("enemy", () => {
      destroy(player);
      go("lose", score);
    });
  }

  player.onCollide(portal.name, () => {
		if (levelId + 1 < LEVELS.length) {
			go("game", {
				levelId: levelId + 1,
				score: score,
        levelLabel : levelLabel + levelId,
			})
		} else {
			go("win", score)
		}
  });

  player.onCollide(coin.name, (coin) => {
    destroy(coin);
    score++;
    scoreLabel.text = score;
  });

  for (let i = 0; i < 2; i++) {
    // generate a random point on screen
    // width() and height() gives the game dimension
    const x = rand(0, width());
    const y = rand(0, height());

    const enemy2 = add([
      sprite(ghostData.name),
      pos(x, y),
      scale(0.1),
      anchor("center"),
      area(),
      state("move"),
      "enemy2",
    ]);

    enemy2.onStateUpdate("move", () => {
      if (!player.exists()) return;
      const dir2 = player.pos.sub(enemy2.pos).unit();
      enemy2.move(dir2.scale(ghostData.speed));
    });

    player.onCollide("enemy2", () => {
      destroy(player);
      go("lose", score);
    });
  }

  /**
   * Character movement controls.
   */

  onKeyDown("right", () => {
    player.move(players.speed, 0);
  });
  onKeyDown("left", () => {
    player.move(-players.speed, 0);
  });
  onKeyDown("up", () => {
    player.move(0, -players.speed);
  });
  onKeyDown("down", () => {
    player.move(0, players.speed);
  });

  /**
   * keep track of score
   * */
  const levelLabel = add([text("Level: " + levelId), pos(width() / 2, 24)]);
  const scoreLabel = add([text("Score: " + score), pos(width() / 2, 70)]);

  /**
   * increment score every frame
   * */
});

/**
 * win scene
 * */

scene("win", (score) => {
  add([
    // list of components
    sprite(fairy.name),
    scale(fairy.scale),
    pos(0, 0),

  ]);
  add([
    sprite("winner"),
    pos(width() / 2, height() / 2 - 70),
    anchor("center"),
  ]);
  // display score
  add([text("Score: " + score), pos(250, 30), scale(1.5), anchor("center")]);
  add([
    text("Press space to restart"),
    pos(width() / 2, height() - 80),
    scale(2),
    anchor("center"),
  ]);

  // go back to game with space is pressed
  onKeyPress("space", () => go("start"));
  onClick(() => go("start"));
});

/**
 * game over scene
 * */

scene("lose", (score) => {
  add([
    // list of components
    sprite(fairy.name),
    scale(fairy.scale),
    pos(0, 0),

  ]);
  add([
    sprite(gameOver.name),
    pos(width() / 2, height() / 2 - 60),
    anchor("center"),
  ]);

  // display score
  add([text("Score: " + score), pos(250, 30), scale(1.5), anchor("center")]);
  add([
    text("Press space to restart"),
    pos(width() / 2, height() - 80),
    scale(2),
    anchor("center"),
  ]);

  // go back to game with space is pressed
  onKeyPress("space", () => go("start"));
  onClick(() => go("start"));
});

/**
 *start with the "game" scene
 */

go("start");
