import React from "react";
import classes from "./Scoreboard.module.css";

export default props => {
  const Player1 = "#dc3545";
  const Player2 = "#007bff";

  const style = {
    background: props.currentTurn === "Player1" ? Player1 : Player2
  };

  return <div className={classes.box} style={style}>
      {props.currentTurn}
      's Turn
      <div className="float-right">
        <h5 style={{ cursor: "pointer", userSelect: "none" }} onClick={props.endGame}>
          X
        </h5>
      </div>
      <div className="float-right mr-4">
        <h5 style={{ cursor: "pointer", userSelect: "none" }} onClick={props.loadMap}>Load Custom Map</h5>
      </div>
    </div>;
};
