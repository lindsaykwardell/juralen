import React from "react";
import { Row, Col, Button } from "reactstrap";
import classes from "./Menu.module.css";

export default props => {
  return (
  <div className={classes.menu}>
    <Row>
      <Col>
          <Button color="dark" style={{width: "100%"}} onClick={() => props.click("details")}>Details</Button>
      </Col>
      <Col>
          <Button color="dark" style={{ width: "100%" }} onClick={() => props.click("commands")}>Commands</Button>
      </Col>
      <Col>
          <Button color="dark" style={{ width: "100%" }} onClick={() => props.click("log")}>Log</Button>
      </Col>
    </Row>
  </div>);
}
