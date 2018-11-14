import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import firebase from "../../config/db/firebase";
import Board from "../../components/Board/Board";
import Details from "../../components/Details/Details";
import MapMakerToolbox from "../../components/MapMakerToolbox/MapMakerToolbox";
import SaveMapModal from "./SaveMapModal/SaveMapModal";
import LoadMapModal from "../../components/LoadMapModal/LoadMapModal";

import classes from "./MapMaker.module.css";

import { generateGrid, openSelectedCell } from "../../config/gameCommands";
import * as Clone from "../../utility/clone";
import Structures from "../../models/Structures/Structures";

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
      saveMapModal: false,
      loadMapModal: false,
      openMapID: null,
      mapName: "",
      mapList: [],
      grid,
      openCell: grid[0][0],
      resources: {
        Player1: { actions: 4, gold: 5, farms: 1, towns: 1, units: 0 },
        Player2: { actions: 4, gold: 5, farms: 1, towns: 1, units: 0 }
      },
      gameLog: []
    };

    this.listener = firebase
      .firestore()
      .collection("customMaps")
      .where("uid", "==", firebase.auth().currentUser.uid)
      .onSnapshot(docs => {
        const mapList = [];
        docs.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          mapList.push(data);
        });
        this.setState({ mapList });
      });
  }

  toggleSaveMapModal = () => {
    this.setState({ saveMapModal: !this.state.saveMapModal });
  };

  toggleLoadMapModal = () => {
    this.setState({ loadMapModal: !this.state.loadMapModal });
  };

  initSaveMap = () => {
    if (this.state.openMapID === null) {
      this.toggleSaveMapModal();
    } else {
      this.saveMap();
    }
  };

  saveMap = () => {
    if (this.state.openMapID === null) {
      firebase
        .firestore()
        .collection("customMaps")
        .add({
          uid: firebase.auth().currentUser.uid,
          name: this.state.mapName.length > 0 ? this.state.mapName : "New Map",
          grid: JSON.stringify(this.state.grid),
          resources: this.state.resources
        })
        .then(docRef => {
          this.setState({
            openMapID: docRef.id,
            mapName:
              this.state.mapName.length > 0 ? this.state.mapName : "New Map"
          });
        });
    } else {
      firebase
        .firestore()
        .collection("customMaps")
        .doc(this.state.openMapID)
        .set(
          {
            name: this.state.mapName,
            grid: JSON.stringify(this.state.grid),
            resources: this.state.resources
          },
          {
            merge: true
          }
        );
    }
    alert("Map saved!");
  };

  loadMap = mapID => {
    firebase
      .firestore()
      .collection("customMaps")
      .doc(mapID)
      .get()
      .then(doc => {
        const data = doc.data();
        this.setState({
          mapName: data.name,
          grid: Clone.Grid(JSON.parse(data.grid)),
          resources: Clone.Resources(data.resources),
          loadMapModal: false
        });
      });
  };

  updateMapNameHandler = e => {
    this.setState({ mapName: e.target.value });
  };

  generateNewGrid = () => {
    const grid = generateGrid(9);
    this.setState({
      grid,
      openCell: Clone.Cell(grid[this.state.openCell.y][this.state.openCell.x])
    });
  };

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
    const newStructure = new Structures[structure]();
    grid[this.state.openCell.y][this.state.openCell.x] = {
      ...grid[this.state.openCell.y][this.state.openCell.x],
      structure: newStructure.structure,
      defBonus: newStructure.defBonus,
      terrain: newStructure.terrain,
      color: newStructure.color,
      specialUnit: newStructure.specialUnit,
      controlledBy: "None"
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
      if (player === "None")
        grid[this.state.openCell.y][this.state.openCell.x].color = Plains;
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
      openCell: Clone.Cell(grid[this.state.openCell.y][this.state.openCell.x])
    });
  };

  clearCell = () => {
    const grid = Clone.Grid(this.state.grid);
    grid[this.state.openCell.y][this.state.openCell.x].terrain = "Plains";
    grid[this.state.openCell.y][this.state.openCell.x].structure = "None";
    grid[this.state.openCell.y][this.state.openCell.x].controlledBy = "None";
    grid[this.state.openCell.y][this.state.openCell.x].color = Plains;
    this.setState({
      grid,
      openCell: Clone.Cell(grid[this.state.openCell.y][this.state.openCell.x])
    });
  };

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <div className={classes.mapMaker}>
        <Row>
          <Col>
            <h1 style={{ display: "inline" }}>Custom Map Maker</h1>{" "}
            <h4 className="ml-4" style={{ display: "inline" }}>
              {this.state.mapName}
            </h4>
          </Col>
          <Col className="m-1">
            <Button
              className="float-right"
              color="light"
              onClick={() => this.props.link("Lobby")}
            >
              Return to Lobby
            </Button>
            <Button
              className="float-right mr-2"
              color="primary"
              onClick={this.toggleLoadMapModal}
            >
              Load Map
            </Button>
            <Button
              className="float-right mr-2"
              color="success"
              onClick={this.toggleSaveMapModal}
            >
              Save Map
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
        <SaveMapModal
          modal={this.state.saveMapModal}
          toggle={this.toggleSaveMapModal}
          mapName={this.state.mapName}
          updateMapName={this.updateMapNameHandler}
          saveMap={this.saveMap}
        />
        <LoadMapModal
          modal={this.state.loadMapModal}
          toggle={this.toggleLoadMapModal}
          mapList={this.state.mapList}
          loadMap={this.loadMap}
        />
      </div>
    );
  }
}
