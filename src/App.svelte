<script>
	export let name;
	import { onMount } from 'svelte';

	class Cell {
		static get ALIVE() {
			return 'alive';
		}
		static get DEAD() {
			return 'dead';
		}

		constructor(state, x, y) {
			this.setState(state);
			this.x = x;
			this.y = y;
		}

		setState(state) {
			this.state = state;
		}

		setNextState(next_state) {
			this.next_state = next_state;
		}

		getNeighborsCount(world) {
			let count = 0;
			for (let x = -1; x < 2; x++) {
				for (let y = -1; y < 2; y++) {
					let calculated_x = this.x + x;
					let calculated_y = this.y + y;
					if (calculated_x >= 0 && calculated_x < world.width && calculated_y >= 0 && calculated_y < world.height) {
						if (world.grid[calculated_y][calculated_x].state == Cell.ALIVE) {
							if (x !== 0 || y !== 0) {
								count++;
							}

						}
					}
				}
			}

			return count;
		}
	}

	class World {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.grid = [];

			// Initialize the world
			for (let l = 0; l < height; l++) {
				let line_filled = [];
				for (let c = 0; c < width; c++) {
					line_filled.push(new Cell(Cell.DEAD, c, l));
				}
				this.grid.push(line_filled);
			}
		}

		getCell(x, y) {
			return this.grid[y][x];
		}

		toggleCell(xy) {
			let coords = xy.split(',');
			let x = parseInt(coords[0]);
			let y = parseInt(coords[1]);
			let cell = this.getCell(x, y);
			if (cell.state == Cell.ALIVE) {
				cell.setState(Cell.DEAD);
			} else {
				cell.setState(Cell.ALIVE);
			}
			cell.setNextState(undefined);
		}

		nextGen() {
			// Who lives, who dies
			for (let l = 0; l < this.height; l++) {
				for (let c = 0; c < this.width; c++) {
					let cell = this.getCell(c, l);
					let neighbors_count = cell.getNeighborsCount(this);
					if (cell.state == Cell.ALIVE) {
						if (neighbors_count == 2 || neighbors_count == 3) {
							cell.setNextState(Cell.ALIVE);
						} else {
							cell.setNextState(Cell.DEAD);
						}
					} else {
						if (neighbors_count == 3) {
							cell.setNextState(Cell.ALIVE);
						}
					}
				}
			}

			// Advance generation
			for (let l = 0; l < this.height; l++) {
				for (let c = 0; c < this.width; c++) {
					let cell = this.getCell(c, l);
					cell.state = cell.next_state === undefined ? Cell.DEAD : cell.next_state;
				}
			}
		}

		updateTable(table) {
			for (let l = 0; l < this.height; l++) {
				for (let c = 0; c < this.width; c++) {
					let cell = this.getCell(c, l);
					let color = cell.state == Cell.ALIVE ? 'black' : 'white';
					let td_id = String(c) + ',' + String(l);
					let table_cell = document.getElementById(td_id);
					table_cell.style.backgroundColor = color;
				}
			}
		}
	}

	function advanceGeneration() {
		world.nextGen();
		world.updateTable(document.getElementById('table'));
	}

	function toggleCell(event) {
		world.toggleCell(event.target.id);
		world.updateTable(document.getElementById('table'));
	}

	onMount(async () => {
		world.updateTable(document.getElementById('grid'));
	});

	// World definition
	var grid_config = {
		width: 41,
		height: 41,
	};
	var world = new World(grid_config.width, grid_config.height);

	// World initial state
	world.getCell(21,19).setState(Cell.ALIVE);
	world.getCell(20,20).setState(Cell.ALIVE);
	world.getCell(21,20).setState(Cell.ALIVE);
	world.getCell(22,20).setState(Cell.ALIVE);
	world.getCell(21,21).setState(Cell.ALIVE);

	world.getCell(4,2).setState(Cell.ALIVE);
	world.getCell(5,3).setState(Cell.ALIVE);
	world.getCell(5,4).setState(Cell.ALIVE);
	world.getCell(4,4).setState(Cell.ALIVE);
	world.getCell(3,4).setState(Cell.ALIVE);
</script>

<main>
	<h1>{name}</h1>
	<p class="subtitle">Technologies: Javascript + some Svelte. Using DOM (no canvas).</p>
	<p class="signature"><a href="https://github.com/llagerlof/game-of-life-dom">GitHub</a> | Author: Lawrence Lagerlof</p>

	<p>Grid width: {grid_config.width} | Grid height: {grid_config.height}</p>

	<div id="grid_container">
		<table class="grid">
		{#each Array(grid_config.height) as _, row}
			<tr>
			{#each Array(grid_config.width) as _, col}
				<td id="{col},{row}" on:click={toggleCell}></td>
			{/each}
			</tr>
		{/each}
		</table>
	</div>

	<button on:click={advanceGeneration}>Advance generation</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
		margin-bottom: 0;
	}

	p.subtitle {
		font-size: 1em;
		font-weight: 100;
		margin-bottom: 0em;
	}

	p.signature {
		font-size: 1em;
		margin-bottom: 3em;
		font-weight: 100;
	}

	table {
		border-collapse: collapse;
		border-width: 1px;
		border-style: solid;
		margin: 0 auto;
	}
	table.grid > tr > td {
		width: 10px;
		height: 10px;
		border-width: 1px;
		border-style: solid;
		border-color: #cccccc;
		background-color: white;
	}

	button {
		margin-top: 1em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
