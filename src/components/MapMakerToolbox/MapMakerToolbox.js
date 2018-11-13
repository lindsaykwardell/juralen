import React from "react";
import { Button } from "reactstrap";
import classes from "./MapMakerToolbox.module.css";

import castle from "../../img/castle.png";
import town from "../../img/town.jpg";
import mountain from "../../img/mountain.png";
import forest from "../../img/forest.png";

export default props => {
  return <div className={classes.toolbox}>
      <div>
      <Button color="dark" onClick={props.generateNewGrid}>
        Generate New Board
        </Button>
        <Button color="dark" onClick={props.emptyBoard}>
          Empty Board
        </Button>
        <Button color="dark" onClick={props.clearCell}>
          Clear tile
        </Button>
      </div>
      <div>
        <Button color="secondary" onClick={() => props.assignPlayer("None")}>
          Unassign Player
        </Button>
        <Button color="danger" onClick={() => props.assignPlayer("Player1")}>
          Assign Player 1
        </Button>
        <Button color="primary" onClick={() => props.assignPlayer("Player2")}>
          Assign Player 2
        </Button>
      </div>
      <div>
        <Button color="light" onClick={() => props.placeStructure("Castle")}>
          <img src={castle} alt="castle" />
          <br />
          Place a castle
        </Button>
        <Button color="light" onClick={() => props.placeStructure("Town")}>
          <img src={town} alt="town" />
          <br />
          Place a town
        </Button>
        <Button color="secondary" onClick={() => props.placeTerrain("Mountain")}>
          <img src={mountain} alt="mountain" />
          <br />
          Place a mountain
        </Button>
        <Button color="success" onClick={() => props.placeTerrain("Forest")}>
          <img src={forest} alt="forest" />
          <br />
          Place a forest
        </Button>
      </div>
    </div>;
};
