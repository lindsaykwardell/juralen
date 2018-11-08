import React, { Component } from "react";
import { Button } from "reactstrap";

import Lobby from "./Lobby/Lobby";
import Game from "./Game/Game";

import firebase from "../../config/db/firebase";
import isElectron from "../../config/isElectron";

import celticWarrior from "../../audio/celtic-warrior.mp3";

export default class Home extends Component {
  constructor() {
    super();
    const defaultName = localStorage.getItem("GameName") || "New Game";
    this.state = {
      gameName: defaultName,
      gridSize: "9",
      gameMode: "hotseat",
      hostingGame: false,
      isGameStarted: false,
      usingSavedGame: false,
      availableGames: [],
      selectedGame: "",
      menuOption: "new",
      audio: new Audio()
    };

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
  }

  componentDidMount() {
    if (isElectron) {
      const audio = new Audio();
      audio.src = celticWarrior;
      this.setState({ audio }, () => {
        this.state.audio.play();
        this.state.audio.addEventListener("ended", this.currentAudioDidEnd);
      });
    }
  }

  currentAudioDidEnd = () => {
    const audio = new Audio();
    audio.src = celticWarrior;
    this.setState({ audio }, () => {
      setTimeout(() => {
        this.state.audio.play();
      }, 1000);

      this.state.audio.addEventListener("ended", this.currentAudioDidEnd);
    });
  };

  selectGameHandler = gameID => {
    this.setState({ selectedGame: gameID, gameMode: "online" });
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
    this.props.toggleTransition().then(() => {
      if (isElectron) {
        if (!this.state.isGameStarted) {
          this.state.audio.pause();
          const audio = new Audio();
          audio.src = celticWarrior;
          this.setState({ audio });
        } else {
          setTimeout(() => {
            this.state.audio.play();
          }, 1000);
        }
      }
      this.setState(
        {
          isGameStarted: !this.state.isGameStarted,
          usingSavedGame: false
        },
        () => {
          setTimeout(() => {
            this.props.toggleTransition();
          }, 50);
        }
      );
    });
  };

  updateNameHandler = e => {
    this.setState({ gameName: e.target.value });
    localStorage.setItem("GameName", e.target.value);
  };

  updateGridSizeHandler = e => {
    this.setState({ gridSize: e.target.value });
  };

  updateGameMode = e => {
    this.setState({ gameMode: e.target.value });
  };

  updateMenuOptionHandler = option => {
    this.setState({ menuOption: option });
  };

  render() {
    return (
      <div>
        <div
          style={{
            position: "absolute",
            zIndex: "100"
          }}
        >
          <Button color="light" onClick={() => this.props.link("Settings")}>Settings</Button>
        </div>
        <div>
          {this.state.isGameStarted ? (
            <Game
              gameMode={this.state.gameMode}
              hostingGame={this.state.hostingGame}
              gameName={this.state.gameName}
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
              gameName={this.state.gameName}
              gameMode={this.state.gameMode}
              gridSize={this.state.gridSize}
              menuOption={this.state.menuOption}
              updateMenuOption={this.updateMenuOptionHandler}
              hostGame={this.hostGameHandler}
              joinGame={this.joinGameHandler}
              loadSavedGame={this.loadSavedGame}
              updateName={this.updateNameHandler}
              updateGridSize={this.updateGridSizeHandler}
              updateGameMode={this.updateGameMode}
            />
          )}
        </div>
      </div>
    );
  }
}
