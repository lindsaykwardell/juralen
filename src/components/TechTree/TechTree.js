import React from "react";
import { Row, Col, Button } from "reactstrap";
import classes from "./TechTree.module.css";

export default props => {
  return (
    <div className={classes.box}>
      <h2>Tech Tree</h2>
      <Row>
        <Col>
          <h5>Offense</h5>
          <div>Castles and Towns generate 2 actions</div>
          <div>New Unit - Siege Weapon</div>
          <div>Action cap increased to 16</div>
          <div>Units get +1 attack</div>
          <div>New Unit - Assassin</div>
          <div>Always attack first</div>
        </Col>
        <Col>
          <h5>Utility</h5>
          <div>Unit movement costs reduced by 50%</div>
          <div>New Unit - Archer</div>
          <div>Unit maxMoves increased by 1</div>
          <div>Units get +1 range</div>
          <div>New Unit - Wizard</div>
          <div>If a unit would die, 50% chance of escape if has remaining moves.</div>
        </Col>
        <Col>
          <h5>Defense</h5>
          <div>Farms generate 2 gold</div>
          <div>New Unit - Priest</div>
          <div>Each farm supports 2 units</div>
          <div>Units get +1 HP</div>
          <div>New Unit - Knight</div>
          <div>Units do not take actions to build</div>
        </Col>
      </Row>
    </div>
  );
};
