import Cell from "../models/Cell/Cell";
//import Unit from "../../../../models/Units/Unit";
import * as Clone from "../utility/clone";

//import isElectron from "../../../../config/isElectron";

export const generateGrid = gridSize => {
  const grid = [];
  for (let y = 0; y < gridSize; y++) {
    const row = [];
    for (let x = 0; x < gridSize; x++) {
      const thisCell = new Cell(x, y, gridSize);

      row.push(thisCell);
    }
    grid.push(row);
  }
  return grid;
};

export const loadGame = state => {
  const grid = Clone.Grid(state.grid);
  const openCell = Clone.Cell(grid[state.openCell.y][state.openCell.x]);
  return { ...state, grid, openCell };
};

export const newTurn = (state, gridSize, gameMode) => {
  return new Promise((resolve, reject) => {
    const resources = Clone.Resources(state.resources);
    let me = state.me;
    let notMe = state.notMe;
    let currentTurn = notMe;
    
    resources[notMe].actions = 3 + resources[notMe].towns;
    if (resources[notMe].actions > 8) resources[notMe].actions = 8;
    resources[notMe].gold += resources[notMe].farms;
    if (resources[notMe].gold > 10) resources[notMe].gold = 10;

    if (gameMode !== "online") {
      me = state.notMe;
      notMe = state.me;
    }

    // Return
    resolve({ resources, me, notMe, currentTurn });
  });
};

export const buildNewUnit = (state, Unit, cell) => {
  return new Promise((resolve, reject) => {
    const gameLog = [...state.gameLog];
    const resources = Clone.Resources(state.resources);
    const grid = Clone.Grid(state.grid);
    const newUnit = new Unit();
    newUnit.controlledBy = state.me;

    // Check if player can afford new unit.
    if (
      cell.controlledBy === state.me &&
      resources[state.me].gold >= newUnit.cost &&
      resources[state.me].actions > 0 &&
      resources[state.me].farms > resources[state.me].units
    ) {
      // Add record to log.
      gameLog.unshift(
        `${state.me} built ${newUnit.name} in ${cell.x}, ${cell.y}`
      );

      // Pay for unit
      resources[state.me].gold -= newUnit.cost;
      resources[state.me].actions--;
      resources[state.me].units++;

      // Place unit on grid
      grid[cell.y][cell.x].units[state.me].push(newUnit);

      // Update openCell
      const openCell = Clone.Cell(grid[cell.y][cell.x]);

      // Play appropriate audio
      newUnit.isBuilt();

      // Return
      resolve({ grid, openCell, resources, gameLog });
    } else {
      // Report what prevents purchasing unit to player.
      const errors = [];
      if (resources[state.me].gold < newUnit.cost) {
        errors.push("You do not have enough gold for this unit.");
      }
      if (resources[state.me].actions <= 0) {
        errors.push("You have no more actions this turn.");
      }
      if (resources[state.me].farms <= resources[state.me].units) {
        errors.push("You do not control enough tiles to build this unit.");
      }
      reject(errors);
    }
  });
};

export const selectUnit = (state, unit) => {
  return new Promise((resolve, reject) => {
    const selectedUnits = [...state.selectedUnits];
    const key = selectedUnits.findIndex(unitID => {
      return unitID === unit.ID;
    });
    if (key !== -1) {
      selectedUnits.splice(key, 1);
    } else {
      unit.isClicked();
      selectedUnits.push(unit.ID);
    }
    resolve({ selectedUnits, movingSelectedUnits: false });
  });
};

export const selectAllUnits = units => {
  return new Promise(resolve => {
    const selectedUnits = [];
    units.forEach(unit => {
      if (unit.movesLeft > 0) {
        selectedUnits.push(unit.ID);
        document.getElementById(unit.ID).checked = true;
      }
    });
    resolve({ selectedUnits, movingSelectedUnits: false });
  });
};

export const fortifyStructure = (state, cell) => {
  return new Promise((resolve, reject) => {
    const gameLog = [...state.gameLog];
    const grid = Clone.Grid(state.grid);
    const resources = Clone.Resources(state.resources);

    if (resources[state.me].actions >= 1) {
      if (
        grid[cell.y][cell.x].structure === "Town" &&
        resources[state.me].gold >= 2
      ) {
        resources[state.me].gold -= 2;
        resources[state.me].actions--;
        grid[cell.y][cell.x].fortify();

        gameLog.unshift(`${state.me} fortified a Town (${cell.x},${cell.y})`);
      } else if (
        grid[cell.y][cell.x].structure === "Castle" &&
        resources[state.me].gold >= 1
      ) {
        resources[state.me].gold -= 1;
        resources[state.me].actions--;
        grid[cell.y][cell.x].fortify();

        gameLog.unshift(`${state.me} fortified a Castle (${cell.x},${cell.y})`);
      } else {
        reject("You do not have enough gold.");
      }
      resolve({
        gameLog,
        grid,
        resources,
        openCell: Clone.Cell(grid[cell.y][cell.x])
      });
    } else {
      reject("You do not have enough actions to fortify.");
    }
  });
};

export const upgradeStructure = (state, cell) => {
  return new Promise((resolve, reject) => {
    const gameLog = [...state.gameLog];
    const grid = Clone.Grid(state.grid);
    const resources = Clone.Resources(state.resources);
    if (
      grid[cell.y][cell.x].structure === "Town" &&
      resources[state.me].gold >= 7 &&
      resources[state.me].actions >= 1
    ) {
      resources[state.me].gold -= 7;
      resources[state.me].actions--;
      grid[cell.y][cell.x].upgradeToCastle();

      gameLog.unshift(
        `${state.me} updated a Town to a Castle (${cell.x},${cell.y})`
      );
      resolve({
        grid,
        gameLog,
        resources,
        openCell: Clone.Cell(grid[cell.y][cell.x])
      });
    } else {
      const errors = [];
      if (resources[state.me].gold < 7) {
        errors.push("You do not have enough gold.");
      }
      if (resources[state.me].actions < 1) {
        errors.push("You do not have enough actions.");
      }
      reject(errors);
    }
  });
};

export const toggleMoveMode = state => {
  return new Promise((resolve, reject) => {
    if (state.selectedUnits.length > 0) {
      let moveCost = 0;
      let wizardMove = 1;
      state.selectedUnits.forEach(unitID => {
        let unit = Clone.Unit(
          state.openCell.units[state.me].find(unit => unit.ID === unitID)
        );
        if (unit.name === "Wizard") wizardMove = unit.move;
        moveCost += unit.move;
      });

      moveCost = state.selectedUnits.length * wizardMove;

      resolve({ moveCost, movingSelectedUnits: !state.movingSelectedUnits });
    } else {
      reject("No units selected!");
    }
  });
};

export const openSelectedCell = (state, cell) => {
  return new Promise((resolve, reject) => {
    const grid = Clone.Grid(state.grid);
    const newCell = Clone.Cell(grid[cell.y][cell.x]);
    const prevCell = Clone.Cell(grid[state.openCell.y][state.openCell.x]);
    let resources = Clone.Resources(state.resources);
    let gameLog = [...state.gameLog];

    if (state.movingSelectedUnits) {
      // Get distance
      const distance =
        Math.abs(newCell.x - prevCell.x) + Math.abs(newCell.y - prevCell.y);
      // Check if move is valid
      if (
        state.moveCost * distance <= resources[state.me].actions &&
        newCell.terrain !== "Mountain"
      ) {
        // Subtract actions for move
        resources[state.me].actions -= state.moveCost * distance;
        // Move each unit
        state.selectedUnits.forEach(unitID => {
          let unit = Clone.Unit(
            prevCell.units[state.me].find(unit => unit.ID === unitID)
          );
          // Remove one move
          unit.movesLeft--;
          // Add unit to new cell
          newCell.units[state.me].push(unit);
          // Remove unit from old cell
          prevCell.units[state.me] = prevCell.units[state.me].filter(
            unit => unit.ID !== unitID
          );
        });

        // Check for combat
        if (
          newCell.units[state.me].length > 0 &&
          newCell.units[state.notMe].length > 0
        ) {
          // Run combat
          const combatResult = newCell.runCombat(
            Clone.Resources(resources),
            [...gameLog],
            state.me,
            state.notMe
          );
          resources = combatResult.resources;
          gameLog = combatResult.gameLog;
        }

        // Gain control of uncontested cell
        if (
          newCell.units[state.me].length > 0 &&
          newCell.units[state.notMe].length <= 0 &&
          newCell.terrain === "Plains" &&
          newCell.controlledBy !== state.me
        ) {
          if (newCell.controlledBy === state.notMe) {
            resources[state.notMe].farms--;
            if (
              newCell.structure === "Town" ||
              newCell.structure === "Castle"
            ) {
              resources[state.notMe].towns--;
            }
          }
          newCell.gainControl(state.me);
          resources[state.me].farms++;
          if (newCell.structure === "Town" || newCell.structure === "Castle") {
            resources[state.me].towns++;
          }
        }
      }
    }

    // Update grid to match changes
    grid[prevCell.y][prevCell.x] = Clone.Cell(prevCell);
    grid[newCell.y][newCell.x] = Clone.Cell(newCell);

    resolve({
      selectedUnits: [],
      movingSelectedUnits: false,
      moveCost: 0,
      grid,
      resources,
      openCell: newCell,
      gameLog
    });
  });
};

export const endTurn = state => {
  return new Promise(resolve => {
    const gameLog = [...state.gameLog];
    const grid = Clone.Grid(state.grid);
    grid.forEach(row => {
      row.forEach(cell => {
        cell.units.Player1.forEach(unit => {
          // Restore move limit
          unit.movesLeft = unit.maxMoves;
          // Priests heal the party.
          if (unit.name === "Priest") {
            cell.units.Player1.forEach(otherUnit => {
              if (
                unit.ID !== otherUnit.ID &&
                otherUnit.health < otherUnit.maxHealth
              ) {
                gameLog.unshift(
                  `Player1 Priest heals ${otherUnit.name}! in ${cell.x}, ${
                    cell.y
                  }!`
                );
                otherUnit.health++;
              }
            });
          }
        });
        cell.units.Player2.forEach(unit => {
          // Restore move limit
          unit.movesLeft = unit.maxMoves;
          // Priests heal the party.
          if (unit.name === "Priest") {
            cell.units.Player2.forEach(otherUnit => {
              if (
                unit.ID !== otherUnit.ID &&
                otherUnit.health < otherUnit.maxHealth
              ) {
                gameLog.unshift(
                  `Player2 Priest heals ${otherUnit.name}! in ${cell.x}, ${
                    cell.y
                  }!`
                );
                otherUnit.health++;
              }
            });
          }
        });
      });
    });
    resolve({
      grid,
      gameLog,
      openCell: Clone.Cell(grid[state.openCell.y][state.openCell.x])
    });
  });
};
