kaboom({
	scale: 1,
	background: [0, 0, 0],
	
})

loadSprite("bean", "sprites/sprCC.png")
loadSprite("steel", "sprites/brickCube.png")

/**
 * 
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
const TILE_HEIGHT = TILE_WIDTH;
const SPEED = 480;


function createMazeMap(width, height) {
	const size = width * height;
	function getUnvisitedNeighbours(map, index) {
		const n = []
		const x = Math.floor(index / width)
		if (x > 1 && map[index - 2] === 2) n.push(index - 2)
		if (x < width - 2 && map[index + 2] === 2) n.push(index + 2)
		if (index >= 2 * width && map[index - 2 * width] === 2) n.push(index - 2 * width)
		if (index < size - 2 * width && map[index + 2 * width] === 2) n.push(index + 2 * width)
		return n
	}
	const map = new Array(size).fill(1, 0, size)
	map.forEach((_, index) => {
		const x = Math.floor(index / width)
		const y = Math.floor(index % width)
		if ((x & 1) === 1 && (y & 1) === 1) {
			map[index] = 2
		}
	})

	const stack = [];
	const startX = Math.floor(Math.random() * (width - 1)) | 1;
	const startY = Math.floor(Math.random() * (height - 1)) | 1;
	const start = startX + startY * width;
	map[start] = 0;
	stack.push(start);
	while (stack.length) {
		const index = stack.pop();
		const neighbours = getUnvisitedNeighbours(map, index);
		if (neighbours.length > 0) {
			stack.push(index)
			const neighbour = neighbours[Math.floor(neighbours.length * Math.random())];
			const between = (index + neighbour) / 2;
			map[neighbour] = 0;
			map[between] = 0;
			stack.push(neighbour);
		}
	}
	return map;
}




/**
 * Creates level map
 */

function createMazeLevelMap(width, height, options) {
	const symbols = options?.symbols || {};
	const map = createMazeMap(width, height);
	const space = symbols[" "] || " ";
	const fence = symbols["#"] || "#";
	const detail = [
		space,
		symbols["╸"] || "╸",   //  1
		symbols["╹"] || "╹",   //  2
		symbols["┛"] || "┛",   //  3
		symbols["╺"] || "╺",   //  4
		symbols["━"] || "━",   //  5
		symbols["┗"] || "┗",   //  6
		symbols["┻"] || "┻",   //  7
		symbols["╻"] || "╻",   //  8
		symbols["┓"] || "┓",   //  9
		symbols["┃"] || "┃",   //  a
		symbols["┫"] || "┫",   //  b
		symbols["┏"] || "┏",   //  c
		symbols["┳"] || "┳",   //  d
		symbols["┣"] || "┣",   //  e
		symbols["╋ "] || "╋ ", //  f
	]
	const symbolMap = options?.detailed ? map.map((s, index) => {
		if (s === 0) return space
		const x = Math.floor(index % width)
		const leftWall = x > 0 && map[index - 1] == 1 ? 1 : 0
		const rightWall = x < width - 1 && map[index + 1] == 1 ? 4 : 0
		const topWall = index >= width && map[index - width] == 1 ? 2 : 0
		const bottomWall = index < height * width - width && map[index + width] == 1 ? 8 : 0
		return detail[leftWall | rightWall | topWall | bottomWall];
	}) : map.map((s) => {
		return s == 1 ? fence : space;
	})
	const levelMap = []
	for (let i = 0; i < height; i++) {
		levelMap.push(symbolMap.slice(i * width, i * width + width).join(""))
	}
	return levelMap;
}




/**
 *  Creates a maze level.
 */

const level = addLevel(
	createMazeLevelMap(9, 9, {}),
	{
		tileWidth: TILE_WIDTH,
		tileHeight: TILE_HEIGHT,
		tiles: {
			"#": () => [
				sprite("steel"),
				tile({ isStatic: true }),
			],
		},
	},
)




/**
 * Character spawning
 */

const bean = add([
    // list of components
    sprite("bean"),
    pos(80, 40),
    area(),
    body(),
  ]);




/**
 * Character movement controls.
 */

onKeyDown("right", () => {
    bean.move(SPEED, 0);
  });
  onKeyDown("left", () => {
    bean.move(-SPEED, 0);
  });
  onKeyDown("up", () => {
    bean.move(0, -SPEED);
  });
  onKeyDown("down", () => {
    bean.move(0, SPEED);
  });

// onClick(() => {
// 	const pos = mousePos()
// 	bean.setTarget(vec2(
// 		Math.floor(pos.x / TILE_WIDTH) * TILE_WIDTH + TILE_WIDTH / 2,
// 		Math.floor(pos.y / TILE_HEIGHT) * TILE_HEIGHT + TILE_HEIGHT / 2,
// 	))
// });
});




/**
 *game over scene
 * */ 

scene("lose", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 108),
		scale(3),
		anchor("center"),
	])

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 108),
		scale(3),
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

