import CellClass from "../models/Cell/Cell";
import UnitClass from "../models/Units/Unit";

export const Grid = grid => {
  return grid.map(row => row.map(cell => Cell(cell)));
};

export const Cell = cell => {
  return Object.assign(Object.create(Object.getPrototypeOf(new CellClass())), cell, {
    units: {
      Player1: cell.units.Player1.map(unit => Unit(unit)),
      Player2: cell.units.Player2.map(unit => Unit(unit))
    }
  });
};

export const Unit = unit => {
  return Object.assign(Object.create(Object.getPrototypeOf(new UnitClass())), unit);
};

export const Resources = resources => {
  const keys = Object.keys(resources);
  const clonedResources = {};
  keys.forEach(key => {
    clonedResources[key] = { ...resources[key] };
  });
  return clonedResources;
};
