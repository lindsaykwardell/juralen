import * as Clone from "./clone";

export const analyzeMoves = state => {
  const grid = Clone.Grid(state.grid);
  const resources = Clone.Resources(state.resources);
  const me = state.me;
  const notMe = state.notMe;

  const results = [];

  grid.forEach(row => {
    row.forEach(cell => {
      if (cell.controlledBy === me) {
        if (cell.structure !== "None") {
          if (resources[me].actions >= 1 && resources[me].gold >= 2) {
            results.push({
              x: cell.x,
              y: cell.y,
              action: "build:Soldier",
              desc: "Build Soldier",
              id: []
            });
          }
          if (
            cell.structure === "Castle" &&
            resources[me].actions >= 1 &&
            resources[me].gold >= 2
          ) {
            results.push({
              x: cell.x,
              y: cell.y,
              action: "fortify",
              desc: "Fortify",
              id: []
            });
          }
          if (cell.structure === "Town") {
            let cost = () => {
              switch (cell.specialUnit) {
                case "Soldier":
                  return 2;
                case "Archer":
                  return 3;
                case "Priest":
                  return 4;
                case "Assassin":
                  return 5;
                case "Knight":
                  return 6;
                case "Wizard":
                  return 7;
                default:
                  return 0;
              }
            };
            if (resources[me].actions >= 1 && resources[me].gold >= cost()) {
              results.push({
                x: cell.x,
                y: cell.y,
                action: `build:${cell.specialUnit}`,
                desc: `Build ${cell.specialUnit}`,
                id: []
              });
            }
            if (resources[me].actions >= 1 && resources[me].gold >= 7)
              results.push({
                x: cell.x,
                y: cell.y,
                action: "upgrade:Castle",
                desc: "Upgrade to Castle",
                id: []
              });
          }
        }
      }
      if (cell.units[me].length > 0) {
        cell.units[me].forEach(unit => {
          if (unit.movesLeft > 0 && unit.move <= resources[me].actions) {
            results.push({
              x: cell.x,
              y: cell.y,
              action: "move",
              desc: `Move ${unit.name}`,
              id: [unit.ID],
              units: [unit]
            });
            cell.units[me].forEach(unit2 => {
              if (
                unit2.ID !== unit.ID &&
                unit2.movesLeft > 0 &&
                unit.move + unit2.move <= resources[me].actions
              ) {
                let key = results.findIndex(el => {
                  return (
                    el.id.includes(unit2.ID) &&
                    el.id.includes(unit.ID) &&
                    el.id.length === 2
                  );
                });
                if (key === -1) {
                  results.push({
                    x: cell.x,
                    y: cell.y,
                    action: "move",
                    desc: `Move ${unit.name} and ${unit2.name}`,
                    id: [unit.ID, unit2.ID],
                    units: [unit, unit2]
                  });
                }

                cell.units[me].forEach(unit3 => {
                  if (
                    unit3.ID !== unit.ID &&
                    unit3.ID !== unit2.ID &&
                    unit3.movesLeft > 0 &&
                    unit.move + unit2.move + unit3.move <= resources[me].actions
                  ) {
                    let key = results.findIndex(el => {
                      return (
                        el.id.includes(unit3.ID) &&
                        el.id.includes(unit2.ID) &&
                        el.id.includes(unit.ID) &&
                        el.id.length === 3
                      );
                    });
                    if (key === -1) {
                      results.push({
                        x: cell.x,
                        y: cell.y,
                        action: "move",
                        desc: `Move ${unit.name}, ${unit2.name}, and ${
                          unit3.name
                        }`,
                        id: [unit.ID, unit2.ID, unit3.ID],
                        units: [unit, unit2, unit3]
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  results.sort((a, b) => {
    let scorea = scoreMove(grid, resources, me, notMe, a);
    let scoreb = scoreMove(grid, resources, me, notMe, b);

    if (scorea > scoreb) return -1;
    if (scoreb < scorea) return 1;
    if (scorea === scoreb) {
      // Check proximity to enemy
      const enemyCells = [];
      grid.forEach(row => {
        row.forEach(cell => {
          if (cell.units[notMe].length > 0 || cell.controlledBy === notMe) {
            enemyCells.push(Clone.Cell(cell));
          }
        });
      });
      enemyCells.forEach(cell => {
        const adiff = getDistance(grid[a.y][a.x], cell);
        const bdiff = getDistance(grid[b.y][b.x], cell);
        if (adiff > bdiff) scoreb++;
        if (adiff < bdiff) scorea++;
      });
      if (scorea > scoreb) return -1;
      if (scoreb < scorea) return 1;
    }
    return 0;
  });

  return results;
};

const scoreMove = (grid, resources, me, notMe, a) => {
  let scorea = 0;
  if (a.action.includes("fortify")) {
    let cost = 3;
    if (grid[a.y][a.x].structure === "Castle") {
      cost = 2;
    }
    if (resources[me].gold >= cost) {
      scorea++;
      if (grid[a.y][a.x].defBonus < 3) {
        scorea++;
      }
    }
  } else if (a.action.includes("build")) {
    const action = a.action.split(":");
    let cost = () => {
      switch (action[1]) {
        case "Soldier":
          return 2;
        case "Archer":
          scorea++;
          return 3;
        case "Priest":
          scorea++;
          return 4;
        case "Assassin":
          scorea += 2;
          return 5;
        case "Knight":
          scorea += 3;
          return 6;
        case "Wizard":
          scorea += 2;
          return 7;
        default:
          return 0;
      }
    };
    if (
      resources[me].gold >= cost() &&
      resources[me].units < resources[me].farms
    ) {
      scorea += 2;
      if (resources[me].farms / 2 >= resources[me].units) {
        scorea += 2;
      }

      if (grid[a.y][a.x].units[me].length === 0) {
        scorea += 2;
      } else if (grid[a.y][a.x].units[me].length <= 1) {
        scorea++;
      }
    }
  } else if (a.action.includes("move")) {
    if (resources[me].actions >= 1) {
      scorea++;
    }
    if (resources[me].farms === resources[me].units) {
      scorea += 5;
    }
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.structure !== "None" && cell.units[notMe].length <= 0 && cell.controlledBy !== me) {
          const distance = getDistance(grid[a.y][a.x], cell);
          const bonus = 5 - distance < 0 ? 0 : 5 - distance;
          scorea += bonus;
        }
      });
    });
  }

  return scorea;
};

const getDistance = (thisCell, enemyCell) => {
  const xdiff = Math.abs(thisCell.x - enemyCell.x);
  const ydiff = Math.abs(thisCell.y - enemyCell.y);
  return xdiff + ydiff;
};
