import React, { Component } from "react";

import Lobby from "./Lobby/Lobby";
import Game from "./Game/Game";

import firebase from "../../config/db/firebase";

export default class Home extends Component {
  state = {
    playerName: "",
    gridSize: "9",
    gameMode: "hotseat",
    hostingGame: false,
    isGameStarted: false,
    usingSavedGame: false,
    availableGames: [],
    selectedGame: ""
  };

  componentWillMount() {
    const defaultName = localStorage.getItem("PlayerName") || "Player 1";
    firebase
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
    this.setState({ playerName: defaultName });
  }

  selectGameHandler = gameID => {
    this.setState({ selectedGame: gameID });
  };

  loadSavedGame = () => {
    this.setState({ isGameStarted: true, usingSavedGame: true });
  };

  hostGameHandler = () => {
    this.setState({ hostingGame: true }, () => {
      this.toggleGameState();
    });
  };

  joinGameHandler = () => {
    this.setState({ hostingGame: false }, () => {
      this.toggleGameState();
    });
  };

  toggleGameState = () => {
    this.setState({
      isGameStarted: !this.state.isGameStarted,
      usingSavedGame: false
    });
  };

  updateNameHandler = e => {
    this.setState({ playerName: e.target.value });
    localStorage.setItem("PlayerName", e.target.value);
  };

  updateGridSizeHandler = e => {
    this.setState({ gridSize: e.target.value });
  };

  updateGameMode = e => {
    this.setState({ gameMode: e.target.value });
  };

  render() {
    return (
      <div className="mt-2">
        {this.state.isGameStarted ? (
          <Game
            gameMode={this.state.gameMode}
            hostingGame={this.state.hostingGame}
            gameName={this.state.playerName}
            selectedGame={this.state.selectedGame}
            gridSize={this.state.gridSize}
            usingSavedGame={this.state.usingSavedGame}
            endGame={this.toggleGameState}
          />
        ) : (
          <Lobby
            availableGames={this.state.availableGames}
            selectedGame={this.state.selectedGame}
            selectGame={this.selectGameHandler}
            playerName={this.state.playerName}
            gameMode={this.state.gameMode}
            gridSize={this.state.gridSize}
            hostGame={this.hostGameHandler}
            joinGame={this.joinGameHandler}
            loadSavedGame={this.loadSavedGame}
            updateName={this.updateNameHandler}
            updateGridSize={this.updateGridSizeHandler}
            updateGameMode={this.updateGameMode}
          />
        )}
      </div>
    );
  }
}
