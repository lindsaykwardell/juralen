import * as Clone from "./clone";

export const analyzeMoves = state => {
  const grid = Clone.Grid(state.grid);
  const resources = Clone.Resources(state.resources);
  const me = state.me;
  const notMe = state.notMe;

  const enemyCells = [];
  const myCells = [];
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell.units[notMe].length > 0 || cell.controlledBy === notMe) {
        enemyCells.push(Clone.Cell(cell));
      }
    });
  });
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell.units[me].length > 0 || cell.controlledBy === me) {
        myCells.push(Clone.Cell(cell));
      }
    });
  });

  const results = getMoveList(grid, resources, me, notMe, enemyCells);

  results.forEach(result => {
    result.score = scoreMove(grid, enemyCells, resources, me, notMe, result);
    if (result.score < 0) result.action = "null";
  });

  results.sort((a, b) => {
    let scorea = a.score;
    let scoreb = b.score;

    if (scorea === scoreb) {
      // Check proximity to enemy

      enemyCells.forEach(cell => {
        const adiff = getDistance(grid[a.y][a.x], cell);
        const bdiff = getDistance(grid[b.y][b.x], cell);
        if (adiff > bdiff) scoreb++;
        if (adiff < bdiff) scorea++;
      });
    }
    // Will need to add more checks here

    return scoreb - scorea;
  });

  return results;
};

const getMoveList = (grid, resources, me, notMe, enemyCells) => {
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
            resources[me].gold >= 1
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
                  return 1;
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
            if (resources[me].actions >= 1 && resources[me].gold >= 7) {
              results.push({
                x: cell.x,
                y: cell.y,
                action: "upgrade:Castle",
                desc: "Upgrade to Castle",
                id: []
              });
            }
            if (resources[me].actions >= 1 && resources[me].gold >= 2) {
              results.push({
                x: cell.x,
                y: cell.y,
                action: "fortify",
                desc: "Fortify",
                id: []
              });
            }
          }
        }
      }
      if (cell.units[me].length > 0) {
        cell.units[me].forEach(unit => {
          if (unit.movesLeft > 0 && unit.move <= resources[me].actions) {
            let thisOptimalMove = optimalMove(
              grid,
              resources,
              cell,
              enemyCells,
              me,
              notMe,
              [unit]
            );
            if (thisOptimalMove.score > 0)
              results.push({
                x: cell.x,
                y: cell.y,
                action: thisOptimalMove.isCombat ? "attack" : "move",
                desc: `Move ${unit.name}`,
                id: [unit.ID],
                units: [unit],
                coords: [thisOptimalMove.x, thisOptimalMove.y]
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
                  thisOptimalMove = optimalMove(
                    grid,
                    resources,
                    cell,
                    enemyCells,
                    me,
                    notMe,
                    [unit, unit2]
                  );
                  if (thisOptimalMove.score > 0)
                    results.push({
                      x: cell.x,
                      y: cell.y,
                      action: thisOptimalMove.isCombat ? "attack" : "move",
                      desc: `Move ${unit.name} and ${unit2.name}`,
                      id: [unit.ID, unit2.ID],
                      units: [unit, unit2],
                      coords: [thisOptimalMove.x, thisOptimalMove.y]
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
                      thisOptimalMove = optimalMove(
                        grid,
                        resources,
                        cell,
                        enemyCells,
                        me,
                        notMe,
                        [unit, unit2, unit3]
                      );
                      if (thisOptimalMove.score > 0)
                        results.push({
                          x: cell.x,
                          y: cell.y,
                          action: thisOptimalMove.isCombat ? "attack" : "move",
                          desc: `Move ${unit.name}, ${unit2.name}, and ${
                            unit3.name
                          }`,
                          id: [unit.ID, unit2.ID, unit3.ID],
                          units: [unit, unit2, unit3],
                          coords: [thisOptimalMove.x, thisOptimalMove.y]
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

  return results;
};

const scoreMove = (grid, enemyCells, resources, me, notMe, a) => {
  let scorea = 0;
  if (a.action.includes("attack")) {
    scorea += 10;
  }
  if (a.action.includes("fortify")) {
    let cost = 2;
    if (grid[a.y][a.x].structure === "Castle") {
      cost = 1;
      scorea += 2;
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
          return 1;
        case "Archer":
          scorea++;
          return 3;
        case "Priest":
          //scorea++;
          if (grid[a.y][a.x].units[me].length <= 0) {
            scorea -= 1000;
          } else {
            let onlyPriests = true;
            grid[a.y][a.x].units[me].forEach(unit => {
              if (unit.name !== "Priest") {
                onlyPriests = false;
              }
            });
            if (onlyPriests) scorea -= 1000;
            else scorea++;
          }
          grid[a.y][a.x].units[me].forEach(unit => {
            if (unit.health < unit.maxHealth) {
              scorea += 3;
            }
          });
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
      resources[me].units >= resources[me].farms ||
      resources[me].gold < cost()
    ) {
      scorea -= 1000;
    } else {
      //scorea += 2;
      scorea += Math.abs(grid[a.y][a.x].units[me].length - 8);
      if (resources[me].farms / 2 >= resources[me].units) {
        scorea += 2;
      }
      let distanceToEnemy = 100;
      let enemyCoords = { x: 0, y: 0 };
      enemyCells.forEach(enemyCell => {
        let thisDistanceToEnemy = getDistance(grid[a.y][a.x], enemyCell);
        if (
          distanceToEnemy < thisDistanceToEnemy &&
          enemyCell.units[notMe].length > 0
        )
          distanceToEnemy = thisDistanceToEnemy;
      });
      if (distanceToEnemy <= 4) {
        if (
          grid[a.y][a.x].units[me].length <=
          grid[enemyCoords.y][enemyCoords.x].units[notMe].length
        ) {
          scorea += 100;
        }
      }
    }
  } else if (a.action.includes("move")) {
    if (resources[me].towns <= 2) {
      let demerit = 10;
      if (resources[me].farms === resources[me].units) {
        demerit = 0;
      }
      if (a.units.length > 1) {
        demerit += 10;
      } else {
        demerit -= 5;
      }
      scorea += -demerit + grid[a.y][a.x].units[me].length;
    }
    if (resources[me].actions >= 1) {
      scorea++;
    }
    if (resources[me].farms <= resources[me].units) {
      scorea += 5;
    }
    if (
      grid[a.y][a.x].units[me].length <= 2 &&
      grid[a.y][a.x].structure !== "None"
    ) {
      scorea -= 2;
      let distanceToEnemy = 100;
      let enemyCount = 0;
      enemyCells.forEach(enemyCell => {
        let thisDistanceToEnemy = getDistance(grid[a.y][a.x], enemyCell);
        if (
          distanceToEnemy > thisDistanceToEnemy &&
          enemyCell.units[notMe].length > 0
        ) {
          distanceToEnemy = thisDistanceToEnemy;
          enemyCount = enemyCell.units[notMe].length;
        }
      });

      if (distanceToEnemy <= 4) {
        scorea -= Math.abs(distanceToEnemy - 6);
      }
      if (
        distanceToEnemy <= 4 &&
        grid[a.y][a.x].units[me].length <= enemyCount
      ) {
        scorea -= 1000;
      }
    }
    grid.forEach(row => {
      row.forEach(cell => {
        if (
          cell.structure !== "None" &&
          cell.units[notMe].length <= 0 &&
          cell.controlledBy !== me
        ) {
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

const getMoveCost = units => {
  let moveCost = 0;
  units.forEach(unit => {
    moveCost += unit.move;
  });
  return moveCost;
};

const optimalMove = (
  grid,
  resources,
  thisCell,
  enemyCells,
  me,
  notMe,
  units
) => {
  let moveOptions = [];
  let thisOptimalMove = {
    x: 0,
    y: 0,
    cost: 100,
    structure: "None",
    distanceToEnemy: 100,
    score: -10
  };
  grid.forEach(row => {
    row.forEach(cell => {
      const distance = getDistance(thisCell, cell);
      const moveCost = getMoveCost(units);
      if (resources[me].actions >= distance * moveCost && distance !== 0) {
        let distanceToEnemy = 100;
        enemyCells.forEach(enemyCell => {
          let thisDistanceToEnemy = getDistance(cell, enemyCell);
          if (distanceToEnemy > thisDistanceToEnemy)
            distanceToEnemy = thisDistanceToEnemy;
        });
        let score = 0;
        if (distance * moveCost < thisOptimalMove.cost)
          score += resources[me].actions - distance * moveCost;
        if (cell.structure !== "None" && cell.controlledBy !== me) score += 5;
        if (cell.controlledBy !== me && cell.terrain === "Plains") score += 2;
        if (cell.terrain === "Forest") score--;
        if (cell.terrain === "Mountain") score -= 100;
        if (cell.controlledBy === me) score -= 3;
        if (
          distanceToEnemy < thisOptimalMove.thisDistanceToEnemy &&
          cell.structure !== "None"
        )
          score++;

        let isCombat = false;
        if (cell.units[notMe].length > 0) {
          let won = 0;
          let lost = 0;
          for (let index = 0; index < 5; index++) {
            const enemyCell = Clone.Cell(cell);
            units.forEach(unit => {
              enemyCell.units[me].push(Clone.Unit(unit));
            });
            enemyCell.runCombat(Clone.Resources(resources), [], me, notMe);
            if (enemyCell.units[me].length > 0) {
              won++;
            } else {
              lost++;
            }
          }
          if (won > lost) {
            isCombat = true;
            score += 3;
          } else {
            score -= 1000;
          }
        }

        // if (
        //   units.length === thisCell.units[me].length &&
        //   thisCell.structure !== "None"
        // ) {
        //   let numberOfNearbyEnemies = 0;
        //   enemyCells.forEach(enemyCell => {
        //     if (enemyCell.units[notMe].length > 0) {
        //       let distance = getDistance(thisCell, enemyCell);
        //       if (distance <= resources[notMe].towns + 3) {
        //         numberOfNearbyEnemies++;
        //       }
        //     }
        //   });
        //   if (
        //     (!isCombat && numberOfNearbyEnemies > 0) ||
        //     (isCombat && numberOfNearbyEnemies > 1)
        //   ) {
        //     score -= 1000;
        //   }
        // }

        // if (resources[me].towns <= 2) {
        //   let demerit = 10;
        //   if (resources[me].farms === resources[me].units) {
        //     demerit = 0;
        //   }
        //   if (units.length > 1) {
        //     demerit += 10;
        //   } else {
        //     demerit -= 5;
        //   }
        //   score += -demerit + thisCell.units[me].length;
        // }

        // //        Don't allow priests to move alone.
        // let priestCount = 0;
        // //let otherUnitCount = 0;
        // units.forEach(unit => {
        //   if (unit.name === "Priest") priestCount++;
        //   //else otherUnitCount++;
        // });
        // if (priestCount === units.length) {
        //   score -= 1000;
        // }

        const thisMove = {
          x: cell.x,
          y: cell.y,
          cost: distance * moveCost,
          structure: cell.structure,
          distanceToEnemy,
          score,
          isCombat
        };
        if (score > thisOptimalMove.score) {
          moveOptions = [thisMove];
          thisOptimalMove = thisMove;
        }
        if (score === thisOptimalMove.score) {
          moveOptions.push(thisMove);
        }
      }
    });
  });
  if (moveOptions.length > 1) {
    const key = Math.floor(Math.random() * moveOptions.length);
    thisOptimalMove = moveOptions[key];
  }

  return thisOptimalMove;
};
