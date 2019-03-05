import React, { Component } from "react";
import { Row, Col, Label, Input } from "reactstrap";

import classes from "./UnitList.module.css";

const Player1 = "#dc3545";
const Player2 = "#007bff";

export default class Commands extends Component {
  render() {
    let units = <div />;
    if (
      this.props.openCell.units &&
      this.props.openCell.units[this.props.me].length > 0
    ) {
      units = (
        <div>
          <div>
            {this.props.openCell.units[this.props.me].map(unit => {
              const style = { border: "1px solid white", width: "100%" };
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
                <div key={unit.ID} style={{ width: "100%", background: unit.controlledBy === "Player1" ? Player1 : Player2}}>
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
                </div>
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
            {units}
          </Col>
        </Row>
      </div>
    );
  }
}
