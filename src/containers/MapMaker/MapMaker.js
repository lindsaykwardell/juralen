import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import Board from "../../components/Board/Board";
import Details from "../../components/Details/Details";
import MapMakerToolbox from "../../components/MapMakerToolbox/MapMakerToolbox";
import classes from "./MapMaker.module.css";

import { generateGrid, openSelectedCell } from "../../config/gameCommands";
import * as Clone from "../../utility/clone";

const Player1 = "#dc3545";
const Player2 = "#007bff";
const Plains = "#9b7653";
const Mountain = "#aaa";
const Forest = "#48854f";

export default class MapMaker extends Component {
  constructor() {
    super();
    const grid = generateGrid(9);
    this.state = {
      grid,
      openCell: grid[0][0],
      resources: {
        Player1: { actions: 4, gold: 5, farms: 1, towns: 1, units: 0 },
        Player2: { actions: 4, gold: 5, farms: 1, towns: 1, units: 0 }
      },
      gameLog: []
    };
  }

  generateNewGrid = () => {
    const grid = generateGrid(9);
    this.setState({
      grid,
      openCell: Clone.Cell(
        grid[this.state.openCell.y][this.state.openCell.x]
      )
    });
  }

  displayGridElementHandler = cell => {
    openSelectedCell(this.state, cell).then(res => {
      this.setState({ ...res });
    });
  };

  placeTerrain = terrain => {
    const grid = Clone.Grid(this.state.grid);
    grid[this.state.openCell.y][this.state.openCell.x].terrain = terrain;
    switch (terrain) {
      case "Mountain":
        grid[this.state.openCell.y][this.state.openCell.x].color = Mountain;
        grid[this.state.openCell.y][this.state.openCell.x].defBonus = 0;
        grid[this.state.openCell.y][this.state.openCell.x].controlledBy =
          "None";
        break;
      case "Forest":
        grid[this.state.openCell.y][this.state.openCell.x].color = Forest;
        grid[this.state.openCell.y][this.state.openCell.x].defBonus = 1;
        grid[this.state.openCell.y][this.state.openCell.x].controlledBy =
          "None";
        break;
      default:
        grid[this.state.openCell.y][this.state.openCell.x].color = Plains;
        grid[this.state.openCell.y][this.state.openCell.x].defBonus = 0;
    }
    if (grid[this.state.openCell.y][this.state.openCell.x].structure !== "None")
      grid[this.state.openCell.y][this.state.openCell.x].structure = "None";
    this.setState({
      grid,
      openCell: Clone.Cell(grid[this.state.openCell.y][this.state.openCell.x])
    });
  };

  placeStructure = structure => {
    const grid = Clone.Grid(this.state.grid);
    grid[this.state.openCell.y][this.state.openCell.x].structure = structure;
    switch (structure) {
      case "Town":
        grid[this.state.openCell.y][this.state.openCell.x].defBonus = 3;
        break;
      case "Castle":
        grid[this.state.openCell.y][this.state.openCell.x].defBonus = 5;
        break;
      default:
        grid[this.state.openCell.y][this.state.openCell.x].defBonus = 0;
    }
    if (
      grid[this.state.openCell.y][this.state.openCell.x].terrain !== "Plains"
    ) {
      grid[this.state.openCell.y][this.state.openCell.x].terrain = "Plains";
      grid[this.state.openCell.y][this.state.openCell.x].color = Plains;
    }
    this.setState({
      grid,
      openCell: Clone.Cell(grid[this.state.openCell.y][this.state.openCell.x])
    });
  };

  assignPlayer = player => {
    const grid = Clone.Grid(this.state.grid);
    if (
      grid[this.state.openCell.y][this.state.openCell.x].terrain === "Plains"
    ) {
      grid[this.state.openCell.y][this.state.openCell.x].controlledBy = player;
      if (player === "Player1")
        grid[this.state.openCell.y][this.state.openCell.x].color = Player1;
      if (player === "Player2")
        grid[this.state.openCell.y][this.state.openCell.x].color = Player2;
      if (player === "None") grid[this.state.openCell.y][this.state.openCell.x].color = Plains;
    }
    this.setState({
      grid,
      openCell: Clone.Cell(grid[this.state.openCell.y][this.state.openCell.x])
    });
  };

  emptyBoard = () => {
    const grid = Clone.Grid(this.state.grid);
    grid.forEach(row => {
      row.forEach(cell => {
        cell.terrain = "Plains";
        cell.structure = "None";
        cell.controlledBy = "None";
        cell.color = Plains;    
      });
    });
    this.setState({
      grid,
      openCell: Clone.Cell(
        grid[this.state.openCell.y][this.state.openCell.x]
      )
    });
  }

  clearCell = () => {
    const grid = Clone.Grid(this.state.grid);
    grid[this.state.openCell.y][this.state.openCell.x].terrain = "Plains";
    grid[this.state.openCell.y][this.state.openCell.x].structure = "None";
    grid[this.state.openCell.y][this.state.openCell.x].controlledBy = "None";
    grid[this.state.openCell.y][this.state.openCell.x].color = Plains;
    this.setState({
      grid,
      openCell: Clone.Cell(
        grid[this.state.openCell.y][this.state.openCell.x]
      )
    });
  }

  render() {
    return (
      <div className={classes.mapMaker}>
        <Row>
          <Col>
            <h1>Custom Map Maker</h1>
          </Col>
          <Col>
            <Button
              className="float-right"
              color="light"
              onClick={() => this.props.link("Lobby")}
            >
              Return to Lobby
            </Button>
          </Col>
        </Row>
        <div className={classes.devArea}>
          <Board
            gameMode="creator"
            grid={this.state.grid}
            gridSize={this.props.gridSize}
            openCell={this.state.openCell}
            movingSelectedUnits={false}
            moveCost={0}
            resources={this.state.resources}
            me={"Player1"}
            displayGridElement={this.displayGridElementHandler}
          />
          <Details
            openCell={this.state.openCell}
            me={"Builder"}
            activeData={""}
          />
          <MapMakerToolbox
            generateNewGrid={this.generateNewGrid}
            emptyBoard={this.emptyBoard}
            clearCell={this.clearCell}
            placeTerrain={this.placeTerrain}
            placeStructure={this.placeStructure}
            assignPlayer={this.assignPlayer}
          />
        </div>
      </div>
    );
  }
}
