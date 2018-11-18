import Cell from "../../models/Cell/Cell";

export default class Scenario {
  constructor(
    scenarioType = "quick",
    loadScenario = { gridSize: { x: 9, y: 9 } }
  ) {
    if (scenarioType === "quick") {
      this.initialGrid = this.generateGrid({ ...loadScenario.gridSize });
      this.initialResources = {
        Player1: { actions: 4, gold: 5, farms: 1, towns: 1, units: 0 },
        Player2: { actions: 4, gold: 5, farms: 1, towns: 1, units: 0 }
      };
      this.me = "Player1";
      this.notMe = "Player2";
      this.objectives = [
        {
          type: "boardControl",
          value: 2
        },
        {
          type: "belowMinTownCount",
          value: 0
        }
      ];
      this.beforeStart = [];
      this.afterEnd = [];
    }
  }

  generateGrid = (gridSize = { x: 9, y: 9 }) => {
    const grid = [];
    for (let y = 0; y < gridSize.y; y++) {
      const row = [];
      for (let x = 0; x < gridSize.x; x++) {
        const thisCell = new Cell(x, y, gridSize.x);

        row.push(thisCell);
      }
      grid.push(row);
    }
    return grid;
  };

  checkObjectives = state => {
    return new Promise((resolve, reject) => {
      this.objectives.forEach(objective => {
        switch (objective.type) {
          case "boardControl":
            let gridControlCount = 0;
            state.grid.forEach(row => {
              row.forEach(cell => {
                if (cell.controlledBy === state.me) gridControlCount++;
              });
            });
            if (
              gridControlCount >=
              (state.grid[0].length * state.grid.length) / objective.value
            ) {
              reject();
            }
            break;
          case "belowMinTownCount":
            if (state.resources[state.notMe].towns === 0) {
              reject();
            }
            break;
          default:
          // Do nothing.
        }
      });
      resolve();
    });
  };
}
