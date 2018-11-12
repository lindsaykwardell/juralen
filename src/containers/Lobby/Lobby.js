import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Container,
  Button,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import firebase from "../../config/db/firebase";

import Menu from "../../components/Menu/Menu";

import bg from "../../img/map.png";

import classes from "./lobby.module.css";

const mapStateToProps = state => {
  return {
    gameName: state.gameName,
    gridSize: state.gridSize,
    gameMode: state.gameMode,
    isHostingGame: state.isHostingGame,
    connectedToGame: state.connectedToGame
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setGameName: e => dispatch({ type: "SET_GAME_NAME", name: e.target.value }),
    setGameMode: mode => dispatch({ type: "SET_GAME_MODE", mode }),
    hostGame: id => dispatch({ type: "HOST_GAME", gameID: id }),
    joinGame: id => dispatch({ type: "JOIN_GAME", gameID: id }),
    setGridSize: e => dispatch({ type: "SET_GRID_SIZE", size: e.target.value })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class Lobby extends Component {
    constructor() {
      super();

      this.state = {
        availableGames: [],
        selectedGame: "",
        menuOption: "new"
      };

      this.listener = firebase
        .firestore()
        .collection("currentGames")
        .where("playerCount", "==", 1)
        .onSnapshot(docs => {
          const availableGames = [];
          docs.forEach(doc => {
            const game = doc.data();
            game.ID = doc.id;
            availableGames.push(game);
          });
          this.setState({ availableGames });
        });
    }

    componentWillUnmount() {
      this.listener();
    }

    setMenuOption = menuOption => {
      this.setState({ menuOption });
    };

    setGameModeHandler = e => {
      this.props.setGameMode(e.target.value);
    };

    selectGameHandler = gameID => {
      this.props.setGameMode("online");
      console.log(gameID);
      this.setState({ selectedGame: gameID });
    };

    hostGameHandler = () => {
      if (this.props.gameMode === "online") {
        firebase
          .firestore()
          .collection("currentGames")
          .add({
            name: this.props.gameName,
            playerCount: 1
          })
          .then(docRef => {
            this.props.hostGame(docRef.id);
            this.props.link("Game");
          });
      } else {
        this.props.hostGame(null);
        this.props.link("Game");
      }
    };

    joinGameHandler = () => {
      if (this.props.gameMode === "online") {
        firebase
          .firestore()
          .collection("currentGames")
          .doc(this.state.selectedGame)
          .set(
            {
              playerCount: 2
            },
            { merge: true }
          )
          .then(() => {
            this.props.joinGame(this.state.selectedGame);
            this.props.link("Game");
          });
      }
    };

    onLogoutHandler = () => {
      firebase.auth().signOut();
    };

    render() {
      const availableGames = this.state.availableGames.map((game, index) => {
        const isSelected =
          game.ID === this.state.selectedGame
            ? classes.selectedGame
            : classes.availableGame;

        return (
          <div
            key={index}
            className={isSelected}
            onClick={() => this.selectGameHandler(game.ID)}
          >
            {game.name}
          </div>
        );
      });

      return (
        <div>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${bg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover"
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,.75)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                color: "white",
                position: "absolute",
                top: "15px",
                right: "15px"
              }}
            >
              {firebase.auth().currentUser.displayName}
              <Button
                className="ml-3"
                color="light"
                onClick={() => this.props.link("Settings")}
              >
                Settings
              </Button>
              <Button
                className="ml-3"
                color="dark"
                onClick={this.onLogoutHandler}
              >
                Log Out
              </Button>
            </div>
            <Container style={{marginTop: "60px"}}>
              <Row>
                <Col
                  className={
                    this.state.menuOption === "new" ? "" : classes.inactive
                  }
                >
                  <Button
                    color="primary"
                    className={classes.enterGame}
                    onClick={this.hostGameHandler}
                  >
                    <h3>
                      {this.props.gameMode === "hotseat"
                        ? "New Game"
                        : "Host Game"}
                    </h3>
                  </Button>
                </Col>
                <Col
                  className={
                    this.state.menuOption === "join" ? "" : classes.inactive
                  }
                >
                  <Button
                    color="info"
                    className={classes.enterGame}
                    onClick={this.joinGameHandler}
                  >
                    <h3>Join Game</h3>
                  </Button>
                </Col>
              </Row>
            </Container>
            <Container className="p-2">
              <Row>
                <Col
                  className={
                    this.state.menuOption === "new" ? "" : classes.inactive
                  }
                >
                  <div className={classes.box}>
                    <h5>Settings</h5>
                    <hr />
                    <FormGroup>
                      <Label>Game Mode</Label>
                      <Input
                        type="select"
                        name="select"
                        id="exampleSelect"
                        onChange={this.setGameModeHandler}
                        value={this.props.gameMode}
                      >
                        <option value="hotseat">Hotseat</option>
                        <option value="online">Online</option>
                        <option value="computer">Vs. AI</option>
                      </Input>
                    </FormGroup>
                    {this.props.gameMode === "online" ? (
                      <FormGroup>
                        <Label for="gameName">Game Name</Label>
                        <Input
                          id="gameName"
                          type="text"
                          value={this.props.gameName}
                          onChange={this.props.setGameName}
                        />
                      </FormGroup>
                    ) : (
                      ""
                    )}
                    <FormGroup>
                      <Label>Grid Size</Label>
                      <Input
                        type="select"
                        name="select"
                        id="exampleSelect"
                        value={this.props.gridSize}
                        onChange={this.props.setGridSize}
                      >
                        <option value="5">5 x 5</option>
                        <option value="7">7 x 7</option>
                        <option value="9">9 x 9</option>
                        <option value="11">11 x 11</option>
                        <option value="13">13 x 13</option>
                        <option value="15">15 x 15</option>
                      </Input>
                    </FormGroup>
                  </div>
                </Col>
                <Col
                  className={
                    this.state.menuOption === "join" ? "" : classes.inactive
                  }
                >
                  <div className={classes.box}>
                    <h5>Current Games:</h5>
                    <hr />
                    {availableGames}
                  </div>
                </Col>
              </Row>
            </Container>
            <Menu>
              <Row>
                <Col>
                  <Button
                    color="dark"
                    style={{ width: "100%" }}
                    onClick={() => this.setMenuOption("new")}
                  >
                    New
                  </Button>
                </Col>
                <Col>
                  <Button
                    color="dark"
                    style={{ width: "100%" }}
                    onClick={() => this.setMenuOption("join")}
                  >
                    Join
                  </Button>
                </Col>
              </Row>
            </Menu>
          </div>
        </div>
      );
    }
  }
);
