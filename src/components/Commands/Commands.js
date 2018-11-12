import React, { Component } from "react";
import { Row, Col, Button, Label, Input } from "reactstrap";

import classes from "./Commands.module.css";

const Player1 = "#dc3545";
const Player2 = "#007bff";

export default class Commands extends Component {
  render() {
    let buildOption = <div />;
    let upgradeOption = <div />;
    let units = <div />;
    if (
      this.props.openCell.controlledBy === this.props.me &&
      (this.props.openCell.structure === "Town" ||
        this.props.openCell.structure === "Castle")
    ) {
      buildOption = (
        <span>
          <Button
            size="sm"
            id="soldierButton"
            className="mt-1 mr-1"
            color="info"
            onClick={() =>
              this.props.buildUnit(
                this.props.units.Soldier,
                this.props.openCell
              )
            }
          >
            Build Soldier (2)
          </Button>
          {this.props.openCell.specialUnit !== "None" ? (
            <span>
              <Button
                size="sm"
                id="specialUnit"
                className="mt-1 mr-1"
                color="info"
                onClick={() =>
                  this.props.buildUnit(
                    this.props.units[this.props.openCell.specialUnit],
                    this.props.openCell
                  )
                }
              >
                Build {this.props.openCell.specialUnit} (
                {new this.props.units[this.props.openCell.specialUnit]().cost})
              </Button>
            </span>
          ) : (
            ""
          )}
        </span>
      );
      if (this.props.openCell.structure === "Town") {
        upgradeOption = (
          <span>
            <Button
              size="sm"
              id="fortifyButton"
              className="mt-1 mr-1"
              color="warning"
              onClick={() => this.props.fortifyStructure(this.props.openCell)}
            >
              Fortify (3)
            </Button>

            <Button
              size="sm"
              id="upgradeButton"
              className="mt-1 mr-1"
              color="warning"
              onClick={() => this.props.upgradeStructure(this.props.openCell)}
            >
              Upgrade to Castle (7)
            </Button>
          </span>
        );
      }
      if (this.props.openCell.structure === "Castle") {
        upgradeOption = (
          <span>
            <Button
              size="sm"
              id="fortifyButton"
              className="mt-1 mr-1"
              color="warning"
              onClick={() => this.props.fortifyStructure(this.props.openCell)}
            >
              Fortify (2)
            </Button>
          </span>
        );
      }
    }
    if (
      this.props.openCell.units &&
      this.props.openCell.units[this.props.me].length > 0
    ) {
      units = (
        <div>
          <div>
            {this.props.openCell.units[this.props.me].map(unit => {
              const style = { border: "1px solid white" };
              if (
                this.props.selectedUnits.find(el => {
                  return el === unit.ID;
                })
              ) {
                style.border = "1px solid yellow";
              }
              if (unit.movesLeft <= 0) {
                style.border = "1px solid #999";
              }
              return (
                <span key={unit.ID} style={{ paddingRight: "2px" }}>
                  <Label check className="p-2" style={style}>
                    <Input
                      id={unit.ID}
                      type="checkbox"
                      name="selectUnitToMove"
                      className="invisible"
                      value={unit.ID}
                      onClick={() => {
                        if (unit.movesLeft > 0) this.props.selectUnit(unit);
                      }}
                    />{" "}
                    {unit.name}
                    <br />
                    ATK: {unit.attack}
                    <br />
                    HP: {unit.health}
                    <br />
                    Moves: {unit.movesLeft}
                  </Label>
                </span>
              );
            })}
          </div>
        </div>
      );
    }
    return (
      <div className={classes.commands}>
        <Row>
          <Col
            className={
              this.props.activeData !== "commands" ? classes.inactive : ""
            }
          >
            {((this.props.gameMode !== "computer" && this.props.me === this.props.currentTurn) || (this.props.gameMode === "computer" && this.props.me !== "Player2") ) ? (
              <div className={classes.box}>
                {units}
                <hr />
                <Button
                  size="sm"
                  color="success"
                  onClick={this.props.newTurn}
                  style={{ float: "right" }}
                >
                  Pass Turn
                </Button>
                {this.props.openCell &&
                this.props.openCell.units &&
                this.props.openCell.units[this.props.me].length > 0 ? (
                  <Button
                    size="sm"
                    className="mr-1"
                    onClick={this.props.selectAllUnits}
                  >
                    Select All
                  </Button>
                ) : (
                  ""
                )}
                {this.props.selectedUnits.length > 0 ? (
                  <Button
                    size="sm"
                    className="mr-1"
                    onClick={this.props.moveUnits}
                  >
                    Move Selected
                  </Button>
                ) : (
                  ""
                )}
                <br />
                {buildOption} <br />
                {upgradeOption}
              </div>
            ) : (
              <div />
            )}
          </Col>
          <Col
            sm="4"
            className={`${classes.box} ${classes.logboxContainer} ${
              this.props.activeData !== "log" ? classes.inactive : ""
            }`}
          >
            <div className={classes.logbox}>
              {this.props.gameLog.map((log, index) => {
                if (log.includes("Player1: ")) {
                  return (
                    <div
                      key={index}
                      style={{ color: Player1, fontWeight: "bold" }}
                    >
                      {log}
                    </div>
                  );
                }
                if (log.includes("Player2: ")) {
                  return (
                    <div
                      key={index}
                      style={{ color: Player2, fontWeight: "bold" }}
                    >
                      {log}
                    </div>
                  );
                }
                return <div key={index}>{log}</div>;
              })}
            </div>
            <Input
              type="text"
              className="mt-2"
              value={this.props.message}
              onChange={this.props.messageInput}
              onKeyPress={this.props.submitMessage}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
