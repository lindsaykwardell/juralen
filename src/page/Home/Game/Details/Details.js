import React from "react";

import classes from "./Details.module.css";

export default props => {
  if (props.openCell !== undefined) {
    let player1Units = "";
    let player2Units = "";
    if (props.openCell.units) {
      if (props.openCell.units.Player1.length > 0) {
        player1Units = props.openCell.units.Player1.map((unit, index) => {
          if (
            props.openCell.terrain === "Forest" &&
            unit.name === "Assassin" &&
            props.me !== "Player1"
          ) {
            return "";
          }
          return <span key={index}>{unit.name} </span>;
        });
      }
      if (props.openCell.units.Player2.length > 0) {
        player2Units = props.openCell.units.Player2.map((unit, index) => {
          if (
            props.openCell.terrain === "Forest" &&
            unit.name === "Assassin" &&
            props.me !== "Player2"
          ) {
            return "";
          }
          return <span key={index}>{unit.name} </span>;
        });
      }
    }
    
    return (
      <div className={classes.box} style={{ background: props.openCell.color }}>
        <div className="row">
          <div className="col">
            <h3>Details</h3>
          </div>
          <div className="col-auto">
            {props.openCell.x}, {props.openCell.y}
          </div>
        </div>
        <div>
          Controlled By: {props.openCell.controlledBy}
          <br />
          Terrain: {props.openCell.terrain}
          <br />
          Structure: {props.openCell.structure} (Defense Bonus: {props.openCell.defBonus})
          <br />
          Units:
          <br />
          Player 1: {player1Units}
          <br />
          Player 2: {player2Units}
        </div>
      </div>
    );
  } else {
    return <div className={classes.box} />;
  }
};
