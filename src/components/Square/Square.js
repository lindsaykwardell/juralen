import React from "react";
import Radium from "radium";

import classes from "./Square.module.css"

export default Radium(props => {
  const cellIsSelected =
    props.cellData.x === props.openCell.x &&
      props.cellData.y === props.openCell.y
      ? true
      : false;
  let cellIsInRange = false;
  if (props.movingSelectedUnits) {
    const xdiff = Math.abs(props.cellData.x - props.openCell.x);
    const ydiff = Math.abs(props.cellData.y - props.openCell.y);

    if (
      props.resources[props.me].actions >= (xdiff + ydiff) * props.moveCost &&
      props.cellData.terrain !== "Mountain"
    ) {
      cellIsInRange = true;
    }
  }
  let boarderColor = "1px solid black";
  if (cellIsSelected) {
    boarderColor = "2px solid yellow";
  }
  const cell = {
    border: cellIsInRange ? "1px solid yellow" : boarderColor,
    background: props.cellData.color
  };

  const aboveCell = {
    padding: "0",
    opacity: cellIsSelected || cellIsInRange ? "1" : ".8",
    transition: ".3s",
    ":hover": { opacity: cellIsInRange ? ".9" : "1" }
  };

  return <td style={aboveCell}>
      <div className={classes.cell} style={cell} onClick={() => props.onClick(props.cellData)}>
        <div>{props.children}</div>
      </div>
    </td>;
});