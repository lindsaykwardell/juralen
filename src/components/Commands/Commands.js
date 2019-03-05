import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";

import classes from "./Commands.module.css";

export default class Commands extends Component {
  render() {
    let buildOption = <div />;
    let upgradeOption = <div />;
    if (
      this.props.openCell.controlledBy === this.props.me &&
      (this.props.openCell.structure === "Town" ||
        this.props.openCell.structure === "Castle")
    ) {
      buildOption = (
        <Fragment>
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
          ) : (
            ""
          )}
        </Fragment>
      );
      if (this.props.openCell.structure === "Town") {
        upgradeOption = (
          <Fragment>
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
          </Fragment>
        );
      }
      if (this.props.openCell.structure === "Castle") {
        upgradeOption = (
          <Button
            size="sm"
            id="fortifyButton"
            className="mt-1 mr-1"
            color="warning"
            onClick={() => this.props.fortifyStructure(this.props.openCell)}
          >
            Fortify (2)
          </Button>
        );
      }
    }
    return (
      <div className={classes.commands}>
        {(this.props.gameMode !== "computer" &&
          this.props.me === this.props.currentTurn) ||
        (this.props.gameMode === "computer" && this.props.me !== "Player2") ? (
          <div style={{ height: "100%" }}>
            {/*<Button
                  size="sm"
                  color="success"
                  onClick={this.props.newTurn}
                  style={{ float: "right" }}
                >
                  Pass Turn
                </Button>*/}
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
              <Button size="sm" className="mr-1" onClick={this.props.moveUnits}>
                Move Selected
              </Button>
            ) : (
              ""
            )}
            <br />
            {buildOption}<br />
            {upgradeOption}
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}
