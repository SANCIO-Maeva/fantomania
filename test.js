kaboom({
	scale: 1,
	background: [228, 182, 251],
	
})

loadSprite("steel", "sprites/brickCube.png")
loadSprite("ghost", "sprites/ghost-1.png")
loadSprite("ghosty", "sprites/ghost-2.png")
loadSprite("gameOver", "sprites/game-over.png")
loadSprite("portal", "/sprites/portal.png")
loadSprite("winner", "sprites/win.png")
loadSprite("player", "sprites/pac-open-close.png", {
	sliceX: 2, // Nombre de tranches horizontales (2 pour open et close)
	anims: {
	  open: {
		from: 0,
		to: 0, // Première tranche pour l'état "open"
	  },
	  close: {
		from: 1,
		to: 1, // Deuxième tranche pour l'état "close"
	  },
	},
  });



/**
 * Start scene
 */

scene("start", () => {

	function addButton(txt, p, f) {

		// add a parent background object
		const btn = add([
			rect(240, 80, { radius: 8 }),
			pos(width() / 2, height() / 2 - 108),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
		])
	
		// add a child object that displays the text
		btn.add([
			text(txt),
			anchor("center"),
			color(0, 0, 0),
		])
	
		// onHoverUpdate() comes from area() component
		// it runs every frame when the object is being hovered
		btn.onHoverUpdate(() => {
			const t = time() * 10
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7)
			btn.scale = vec2(1.2)
			setCursor("pointer")
		})
	
		// onHoverEnd() comes from area() component
		// it runs once when the object stopped being hovered
		btn.onHoverEnd(() => {
			btn.scale = vec2(1)
			btn.color = rgb()
		})
	
		// onClick() comes from area() component
		// it runs once when the object is clicked
		btn.onClick(f)
	
		return btn
	
	}
	
	// add button 
	addButton("Start", vec2(200, 100), () => go("game"))

})


/**
 * main game scene content
*/ 

scene("game", () => {
	
const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;
const SPEED = 480;
const ENEMY_SPEED = 0;



/**
 *  Creates a maze level.
 */

const level = addLevel([
	// Design the level layout with symbols
	"====================",
	"====================",
	"====================",
	"====================",
	"====================",
	"====================",
	"==================>=",
	"====================",
], {
		tileWidth: TILE_WIDTH,
		tileHeight: TILE_WIDTH,
		pos: vec2(100, 200),
		tiles: {
			"=": () => [
				sprite("steel"),
				area(),
				body({ isStatic: true }),
			],
			">": () => [
				sprite("portal"),
				area(),
				scale(0.1),
				// anchor("bot"),
				"portal",
			],
		},
	},
)



/**
 * Character spawning
 */

const player = add([
    // list of components
    sprite("player"),
	scale(0.15),
    pos(80, 40),
    area(),
    body(),
  ]);

  player.play("open", { loop: true, speed: 0.1 });
  player.play("open", { loop: true, speed: 0.1 });
  

  for (let i = 0; i < 2; i++) {

	// generate a random point on screen
	// width() and height() gives the game dimension
	const x = rand(0, width())
	const y = rand(0, height())
	
	const enemy = add([
		sprite("ghosty"),
		pos(x, y),
		scale(0.1),
		anchor("center"),
		area(),
		body(),
		state("move"),
		"enemy",
	]);

	// Like .onUpdate() which runs every frame, but only runs when the current state is "move"
	// Here we move towards the player every frame if the current state is "move"
	enemy.onStateUpdate("move", () => {
		if (!player.exists()) return
		const dir = player.pos.sub(enemy.pos).unit()
		enemy.move(dir.scale(ENEMY_SPEED))
	})

	player.onCollide("enemy", () => {
		destroy(player)
		go("lose", score)
	})
}

player.onCollide("portal", () => {
	go("win", score)
})

for (let i = 0; i < 2; i++) {

	// generate a random point on screen
	// width() and height() gives the game dimension
	const x = rand(0, width())
	const y = rand(0, height())
	
	const enemy2 = add([
		sprite("ghost"),
		pos(x, y),
		scale(0.1),
		anchor("center"),
		area(),
		body(),
		state("move"),
		"enemy2",
	]);

	enemy2.onStateUpdate("move", () => {
		if (!player.exists()) return
		const dir2 = player.pos.sub(enemy2.pos).unit()
		enemy2.move(dir2.scale(ENEMY_SPEED))
	})

	player.onCollide("enemy2", () => {
		destroy(player)
		go("lose", score)
	})
}


/**
 * Character movement controls.
 */

onKeyDown("right", () => {
    player.move(SPEED, 0);
  });
  onKeyDown("left", () => {
    player.move(-SPEED, 0);
  });
  onKeyDown("up", () => {
    player.move(0, -SPEED);
  });
  onKeyDown("down", () => {
    player.move(0, SPEED);
  });


  /**
   * keep track of score
   * */ 
  let score = 0;

  const scoreLabel = add([text(score), pos(width() / 2, 24)]);

  /**
   * increment score every frame
   * */

  onUpdate(() => {
    score++;
    scoreLabel.text = score;
  });
});

scene("win", (score) => {

	add([
		sprite("winner"),
		pos(width() / 2, height() / 2 - 70),
		anchor("center"),
	])
	// display score
	add([
		text(score),
		pos(80, 30),
		scale(1.5),
		anchor("center"),
	])
	add([
		text('Press space to restart'),
		pos(width() / 2, height() - 80 ),
		scale(2),
		anchor("center"),
	])

	// go back to game with space is pressed
	onKeyPress("space", () => go("start"))
	onClick(() => go("start"))

})


/**
 *game over scene
 * */ 

scene("lose", (score) => {


	add([
		sprite("gameOver"),
		pos(width() / 2, height() / 2 - 60),
		anchor("center"),
	])

	// display score
	add([
		text(score),
		pos(80, 30),
		scale(1.5),
		anchor("center"),
	])
	add([
		text('Press space to restart'),
		pos(width() / 2, height() - 80 ),
		scale(2),
		anchor("center"),
	])

	// go back to game with space is pressed
	onKeyPress("space", () => go("start"))
	onClick(() => go("start"))

})


/**
 *start with the "game" scene 
 */ 

go("start")