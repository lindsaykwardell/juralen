import React from "react";
import { Row, Col } from "reactstrap";
import classes from "./Resources.module.css";

export default props => {
  return (
    <div className={classes.box}>
      <Row>
        <Col>Actions: {props.myResources.actions.toFixed(2)}</Col>
        <Col>Gold: {props.myResources.gold}</Col>
        <Col>Towns: {props.myResources.towns}</Col>
        <Col>Farms: {props.myResources.farms}</Col>
        <Col>Total units: {props.myResources.units}</Col>
      </Row>
    </div>
  );
};
