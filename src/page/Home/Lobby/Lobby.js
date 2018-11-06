import React from "react";
import {
  Row,
  Col,
  Container,
  Button,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import Menu from "../../../components/Menu/Menu";

import bg from "../../../img/map.png";

import classes from "./lobby.module.css";

export default props => {
  const availableGames = props.availableGames.map((game, index) => {
    const isSelected =
      game.ID === props.selectedGame
        ? classes.selectedGame
        : classes.availableGame;

    return (
      <div
        key={index}
        className={isSelected}
        onClick={() => props.selectGame(game.ID)}
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
        <Container className="mt-5">
          <Row>
            <Col className={props.menuOption === "new" ? "" : classes.inactive}>
              <Button
                color="primary"
                className={classes.enterGame}
                onClick={props.hostGame}
              >
                <h3>
                  {props.gameMode === "hotseat" ? "New Game" : "Host Game"}
                </h3>
              </Button>
            </Col>
            <Col
              className={props.menuOption === "join" ? "" : classes.inactive}
            >
              <Button
                color="info"
                className={classes.enterGame}
                onClick={props.joinGame}
              >
                <h3>Join Game</h3>
              </Button>
            </Col>
          </Row>
        </Container>
        <Container className="p-2">
          <Row>
            <Col className={props.menuOption === "new" ? "" : classes.inactive}>
              <div className={classes.box}>
                <h5>Settings</h5>
                <hr />
                <FormGroup>
                  <Label>Game Mode</Label>
                  <Input
                    type="select"
                    name="select"
                    id="exampleSelect"
                    onChange={props.updateGameMode}
                    value={props.gameMode}
                  >
                    <option value="hotseat">Hotseat</option>
                    <option value="online">Online</option>
                  </Input>
                </FormGroup>
                {props.gameMode === "online" ? (
                  <FormGroup>
                    <Label for="playerName">Game Name</Label>
                    <Input
                      id="playerName"
                      type="text"
                      value={props.playerName}
                      onChange={props.updateName}
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
                    defaultValue={props.gridSize}
                    onChange={props.updateGridSize}
                  >
                    <option value="5">5 x 5</option>
                    <option value="7">7 x 7</option>
                    <option value="9">9 x 9</option>
                  </Input>
                </FormGroup>
              </div>
            </Col>
            <Col
              className={props.menuOption === "join" ? "" : classes.inactive}
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
                onClick={() => props.updateMenuOption("new")}
              >
                New
              </Button>
            </Col>
            <Col>
              <Button
                color="dark"
                style={{ width: "100%" }}
                onClick={() => props.updateMenuOption("join")}
              >
                Join
              </Button>
            </Col>
          </Row>
        </Menu>
      </div>
    </div>
  );
};
