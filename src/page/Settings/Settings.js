import React, { Component } from 'react'
import {Container, Row, Col} from "reactstrap";

export default class Settings extends Component {
  render() {
    return (
      <Container>
        <div className="text-center"><h1>Settings</h1></div>
        <Row>
          <Col>Music:</Col>
          <Col>Setting goes here</Col>
        </Row>
        <Row>
          <Col>Sound Effects</Col>
          <Col>Setting goes here</Col>
        </Row>
      </Container>
    )
  }
}
