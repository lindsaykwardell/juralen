import React from "react";
import Square from "../Square/Square";

import castle from "../../img/castle.png";
import town from "../../img/town.jpg";
import forest from "../../img/forest.png";
import mountain from "../../img/mountain.png";

import soldier from "../../img/soldier.png";
import soldiers from "../../img/soldiers.png";

import knight from "../../img/knight.png";
import assassin from "../../img/assassin.jpg";
import archer from "../../img/archer.jpg";
import wizard from "../../img/wizard.png";
import priest from "../../img/priest.jpg";

import classes from "./Board.module.css";

export default props => {
  const renderGrid = props.grid.map((row, y) => {
    return (
      <tr key={y} style={{ border: "0" }}>
        {row.map((cell, x) => {
          let display = cell.display;
          if (cell.structure && cell.structure !== "None") {
            if (cell.structure === "Town") {
              display = (
                <img
                  src={town}
                  alt={cell.structure}
                  className={classes.structure}
                />
              );
            } else if (cell.structure === "Castle") {
              display = (
                <img
                  src={castle}
                  alt={cell.structure}
                  className={classes.structure}
                />
              );
            }
          }
          if (cell.terrain && cell.terrain !== "Plains") {
            if (cell.terrain === "Forest") {
              display = (
                <img
                  src={forest}
                  alt={cell.terrain}
                  className={classes.structure}
                />
              );
            } else if (cell.terrain === "Mountain") {
              display = (
                <img
                  src={mountain}
                  alt={cell.terrain}
                  className={classes.structure}
                />
              );
            } else {
              display = cell.terrain;
            }
          }
          let allUnits = cell.units.Player1.concat(cell.units.Player2);
          while (
            allUnits.filter(unit => {
              return unit.name === "Soldier";
            }).length >= 5
          ) {
            let count = 5;
            while (count > 0) {
              const key = allUnits.findIndex(unit => {
                return unit.name === "Soldier";
              });
              allUnits.splice(key, 1);

              count--;
            }
            allUnits.push({
              name: "Soldiers",
              ID: Math.floor(Math.random() * 100000000000000)
            });
          }
          let renderUnits = allUnits.map(unit => {
            if (unit.name === "Soldier") {
              return (
                <img
                  key={unit.ID}
                  src={soldier}
                  alt="Soldier"
                  className={classes.unit}
                />
              );
            }
            if (unit.name === "Soldiers") {
              return (
                <img
                  key={unit.ID}
                  src={soldiers}
                  alt="Soldiers"
                  className={classes.unit}
                />
              );
            }
            if (unit.name === "Assassin") {
              if (props.gameMode === "hotseat" && cell.terrain !== "Forest") {
                return (
                  <img
                    key={unit.ID}
                    src={assassin}
                    alt="Assassin"
                    className={classes.unit}
                  />
                );
              }
              if (
                props.gameMode === "online" &&
                (cell.terrain !== "Forest" ||
                  (cell.terrain === "Forest" && unit.controlledBy === props.me))
              ) {
                return (
                  <img
                    key={unit.ID}
                    src={assassin}
                    alt="Assassin"
                    className={classes.unit}
                  />
                );
              }
            }
            if (unit.name === "Knight") {
              return (
                <img
                  key={unit.ID}
                  src={knight}
                  alt="Knight"
                  className={classes.unit}
                />
              );
            }
            if (unit.name === "Archer") {
              return (
                <img
                  key={unit.ID}
                  src={archer}
                  alt="Archer"
                  className={classes.unit}
                />
              );
            }
            if (unit.name === "Wizard") {
              return (
                <img
                  key={unit.ID}
                  src={wizard}
                  alt="Wizard"
                  className={classes.unit}
                />
              );
            }
            if (unit.name === "Priest") {
              return (
                <img
                  key={unit.ID}
                  src={priest}
                  alt="Priest"
                  className={classes.unit}
                />
              );
            }
            return "";
          });

          return (
            <Square
              key={x}
              cellData={cell}
              openCell={props.openCell}
              movingSelectedUnits={props.movingSelectedUnits}
              moveCost={props.moveCost}
              resources={props.resources}
              me={props.me}
              onClick={props.displayGridElement}
            >
              &nbsp; {display}
              <br />
              {renderUnits}
            </Square>
          );
        })}
      </tr>
    );
  });

  return (
    <div className={classes.board}>
      <table>
        <tbody>{renderGrid}</tbody>
      </table>
    </div>
  );
};
