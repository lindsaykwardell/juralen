import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "reactstrap";
import firebase from "../../config/db/firebase";

import Board from "../../components/Board/Board";
import Scoreboard from "../../components/Scoreboard/Scoreboard";
import Details from "../../components/Details/Details";
import Resources from "../../components/Resources/Resources";
import Commands from "../../components/Commands/Commands";
import Menu from "../../components/Menu/Menu";
import LoadMapModal from "../../components/LoadMapModal/LoadMapModal";

import Units from "../../models/Units/Units";
import {
  generateGrid,
  loadGame,
  newTurn,
  buildNewUnit,
  selectUnit,
  selectAllUnits,
  fortifyStructure,
  upgradeStructure,
  toggleMoveMode,
  openSelectedCell,
  endTurn
} from "../../config/gameCommands";

import * as Clone from "../../utility/clone";
import { analyzeMoves } from "../../utility/analyze";

import classes from "./Game.module.css";

const initialGameState = {
  resources: {
    Player1: { actions: 4, gold: 5, farms: 1, towns: 1, units: 0 },
    Player2: { actions: 4, gold: 5, farms: 1, towns: 1, units: 0 }
  },
  currentTurn: "Player1",
  me: "Player1",
  notMe: "Player2",
  selectedUnits: [],
  movingSelectedUnits: false,
  moveCost: 0,
  gameLog: [],
  message: "",
  activeData: "commands",
  loadMapModal: false,
  openMapID: "",
  mapList: []
};

const mapStateToProps = state => {
  return {
    gameName: state.gameName,
    gridSize: state.gridSize,
    gameMode: state.gameMode,
    hostingGame: state.isHostingGame,
    usingSavedGame: false,
    selectedGame: state.connectedToGame
  };
};

const mapDispatchToProps = dispatch => {
  return {
    endGame: () => dispatch({ type: "END_GAME" })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class Game extends Component {
    constructor(props) {
      super(props);

      if (props.gameMode === "hotseat" || props.gameMode === "computer") {
        if (props.usingSavedGame) {
          this.state = loadGame(JSON.parse(localStorage.getItem("savedGame")));
        } else {
          const grid = generateGrid(props.gridSize);
          this.state = {
            ...initialGameState,
            grid,
            openCell: grid[0][0]
          };
        }
      }

      if (props.gameMode === "online" && props.hostingGame) {
        const grid = generateGrid(props.gridSize);
        this.state = {
          ...initialGameState,
          grid,
          openCell: grid[0][0],
          gameID: props.selectedGame
        };
      }

      if (props.gameMode === "online" && !props.hostingGame) {
        const grid = generateGrid(props.gridSize);
        this.state = {
          ...initialGameState,
          grid,
          openCell: grid[0][0],
          me: "Player2",
          notMe: "Player1",
          gameID: props.selectedGame
        };
      }
    }

    componentDidMount() {
      if (this.props.gameMode === "online") {
        if (this.props.hostingGame) {
          firebase
            .firestore()
            .collection("currentGames")
            .doc(this.props.selectedGame)
            .set(
              {
                grid: JSON.stringify(this.state.grid),
                resources: this.state.resources,
                currentTurn: this.state.currentTurn,
                gameLog: this.state.gameLog
              },
              { merge: true }
            );
        }
        this.listener = firebase
          .firestore()
          .collection("currentGames")
          .doc(this.props.selectedGame)
          .onSnapshot(
            doc => {
              const data = doc.data();
              if (!data) {
                this.gameCrashedHandler();
              } else {
                const grid = Clone.Grid(JSON.parse(data.grid));
                this.setState({
                  gameID: doc.id,
                  grid,
                  openCell: Clone.Cell(
                    grid[this.state.openCell.y][this.state.openCell.x]
                  ),
                  resources: data.resources,
                  currentTurn: data.currentTurn,
                  gameLog: data.gameLog
                });
              }
            },
            error => {
              this.gameCrashedHandler();
            }
          );
      }
      this.listener2 = firebase
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

    toggleLoadMapModal = () => {
      this.setState({ loadMapModal: !this.state.loadMapModal });
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

    messageInputHandler = e => {
      this.setState({ message: e.target.value });
    };

    submitMessageHandler = e => {
      if (e.key === "Enter") {
        const gameLog = [...this.state.gameLog];
        gameLog.unshift(`${this.state.me}: ${this.state.message}`);
        this.setState({ gameLog, message: "" }, () => {
          if (this.state.gameID) {
            firebase
              .firestore()
              .collection("currentGames")
              .doc(this.state.gameID)
              .set(
                {
                  gameLog: this.state.gameLog
                },
                { merge: true }
              );
          }
        });
      }
    };

    displayGridElementHandler = cell => {
      openSelectedCell(this.state, cell).then(res => {
        this.setState({ ...res }, () => {
          if (this.state.gameID) {
            firebase
              .firestore()
              .collection("currentGames")
              .doc(this.state.gameID)
              .set(
                {
                  grid: JSON.stringify(this.state.grid),
                  resources: this.state.resources,
                  gameLog: this.state.gameLog
                },
                { merge: true }
              );
          }
        });
      });
    };

    buildUnitHandler = (unit, cell) => {
      buildNewUnit(this.state, unit, cell)
        .then(res => {
          this.setState({ ...res }, () => {
            if (this.state.gameID) {
              firebase
                .firestore()
                .collection("currentGames")
                .doc(this.state.gameID)
                .set(
                  {
                    grid: JSON.stringify(this.state.grid),
                    resources: this.state.resources,
                    gameLog: this.state.gameLog
                  },
                  { merge: true }
                );
            }
          });
        })
        .catch(errors => {
          errors.forEach(err => {
            alert(err);
          });
        });
    };

    selectUnitHandler = unit => {
      selectUnit(this.state, unit).then(res => {
        this.setState({ ...res });
      });
    };

    moveUnitsHandler = () => {
      toggleMoveMode(this.state).then(res => {
        this.setState({ ...res }, () => {
          if (this.state.gameID) {
            firebase
              .firestore()
              .collection("currentGames")
              .doc(this.state.gameID)
              .set(
                {
                  grid: JSON.stringify(this.state.grid),
                  resources: this.state.resources,
                  gameLog: this.state.gameLog
                },
                { merge: true }
              );
          }
        });
      });
    };

    fortifyStructureHandler = cell => {
      fortifyStructure(this.state, cell)
        .then(res => {
          this.setState({ ...res }, () => {
            if (this.state.gameID) {
              firebase
                .firestore()
                .collection("currentGames")
                .doc(this.state.gameID)
                .set(
                  {
                    grid: JSON.stringify(this.state.grid),
                    resources: this.state.resources,
                    gameLog: this.state.gameLog
                  },
                  { merge: true }
                );
            }
          });
        })
        .catch(err => {
          alert(err);
        });
    };

    upgradeStructureHandler = cell => {
      upgradeStructure(this.state, cell)
        .then(res => {
          this.setState({ ...res }, () => {
            if (this.state.gameID) {
              firebase
                .firestore()
                .collection("currentGames")
                .doc(this.state.gameID)
                .set(
                  {
                    grid: JSON.stringify(this.state.grid),
                    resources: this.state.resources,
                    gameLog: this.state.gameLog
                  },
                  { merge: true }
                );
            }
          });
        })
        .catch(errors => {
          errors.forEach(err => {
            alert(err);
          });
        });
    };

    newTurnHandler = () => {
      endTurn(this.state).then(res => {
        this.setState({ ...res });
        newTurn(this.state, this.props.gridSize, this.props.gameMode)
          .then(res => {
            this.setState({ ...res }, () => {
              if (this.props.gameMode === "computer" && res.me === "Player2") {
                //if (this.props.gameMode === "computer") {
                this.runComputerTurn();
              }
              if (this.state.gameID) {
                firebase
                  .firestore()
                  .collection("currentGames")
                  .doc(this.state.gameID)
                  .set(
                    {
                      grid: JSON.stringify(this.state.grid),
                      resources: this.state.resources,
                      gameLog: this.state.gameLog,
                      currentTurn: this.state.currentTurn
                    },
                    { merge: true }
                  );
              }
            });
          })
          .catch(() => {
            // end the game
            this.props.endGame();
            this.props.link("Lobby");
          });
      });
    };

    runComputerTurn = () => {
      let prevOption = {};
      const runningTurn = setInterval(() => {
        const options = analyzeMoves(this.state);

        if (options.length > 0) {
          if (JSON.stringify(prevOption) === JSON.stringify(options[0])) {
            clearInterval(runningTurn);
            this.newTurnHandler();
          } else {
            prevOption = options[0];

            const s = options[0];
            if (s.action.includes("build")) {
              const option = s.action.split(":");
              this.displayGridElementHandler(this.state.grid[s.y][s.x]);

              this.buildUnitHandler(
                Units[option[1]],
                this.state.grid[s.y][s.x]
              );
            }
            if (s.action.includes("fortify")) {
              this.fortifyStructureHandler(this.state.grid[s.y][s.x]);
            }
            if (s.action.includes("upgrade")) {
              //const option = s.action.split(":");
              this.upgradeStructureHandler(this.state.grid[s.y][s.x]);
            }
            if (s.action.includes("move") || s.action.includes("attack")) {
              let moveCost = 0;
              s.units.forEach(unit => {
                moveCost += unit.move;
              });
              this.setState(
                {
                  openCell: Clone.Cell(this.state.grid[s.y][s.x]),
                  moveCost,
                  movingSelectedUnits: true,
                  selectedUnits: [...s.id]
                },
                () => {
                  this.displayGridElementHandler(
                    this.state.grid[s.coords[1]][s.coords[0]]
                  );
                }
              );
            }
          }
        } else {
          clearInterval(runningTurn);
          this.newTurnHandler();
        }
      }, 500);
    };

    endGameHandler = () => {
      this.listener2();
      if (this.props.gameMode === "online") {
        this.listener();

        if (this.state.gameID) {
          firebase
            .firestore()
            .collection("currentGames")
            .doc(this.state.gameID)
            .set(
              {
                playerCount: 1
              },
              { merge: true }
            );
          if (this.props.hostingGame) {
            firebase
              .firestore()
              .collection("currentGames")
              .doc(this.state.gameID)
              .delete();
          }
        }
      }
      // End the game
      this.props.endGame();
      this.props.link("Lobby");
    };

    gameCrashedHandler = () => {
      alert("The game has been disconnected.");
      this.setState({ gameID: false }, () => {
        this.endGameHandler();
      });
    };

    menuClickHandler = option => {
      this.setState({ activeData: option });
    };

    render() {
      return (
        <div>
          <div className={classes.game}>
            <Board
              gameMode={this.props.gameMode}
              grid={this.state.grid}
              gridSize={this.props.gridSize}
              openCell={this.state.openCell}
              movingSelectedUnits={this.state.movingSelectedUnits}
              moveCost={this.state.moveCost}
              resources={this.state.resources}
              me={this.state.me}
              displayGridElement={this.displayGridElementHandler}
            />
            <Scoreboard
              currentTurn={this.state.currentTurn}
              endGame={this.endGameHandler}
              loadMap={this.toggleLoadMapModal}
              saveGame={() => {
                localStorage.setItem("savedGame", JSON.stringify(this.state));
                alert("Game saved!");
              }}
            />
            <Resources
              myResources={
                this.state.me === "Player1"
                  ? this.state.resources.Player1
                  : this.state.resources.Player2
              }
            />
            <Details
              openCell={this.state.openCell}
              me={this.state.me}
              activeData={this.state.activeData}
            />
            <Commands
              me={this.state.me}
              notMe={this.state.notMe}
              currentTurn={this.state.currentTurn}
              gameMode={this.props.gameMode}
              openCell={this.state.openCell}
              units={Units}
              buildUnit={this.buildUnitHandler}
              selectedUnits={this.state.selectedUnits}
              moveUnits={this.moveUnitsHandler}
              moveIsActive={this.state.movingSelectedUnits}
              fortifyStructure={this.fortifyStructureHandler}
              upgradeStructure={this.upgradeStructureHandler}
              gameLog={this.state.gameLog}
              message={this.state.message}
              activeData={this.state.activeData}
              messageInput={this.messageInputHandler}
              submitMessage={this.submitMessageHandler}
              newTurn={this.newTurnHandler}
              selectUnit={this.selectUnitHandler}
              selectAllUnits={() => {
                selectAllUnits(this.state.openCell.units[this.state.me]).then(
                  res => {
                    this.setState({ ...res });
                  }
                );
              }}
            />
          </div>
          <Menu>
            <Row>
              <Col>
                <Button
                  color="dark"
                  style={{ width: "100%" }}
                  onClick={() => this.menuClickHandler("details")}
                >
                  Details
                </Button>
              </Col>
              <Col>
                <Button
                  color="dark"
                  style={{ width: "100%" }}
                  onClick={() => this.menuClickHandler("commands")}
                >
                  Commands
                </Button>
              </Col>
              <Col>
                <Button
                  color="dark"
                  style={{ width: "100%" }}
                  onClick={() => this.menuClickHandler("log")}
                >
                  Log
                </Button>
              </Col>
            </Row>
          </Menu>
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
);
