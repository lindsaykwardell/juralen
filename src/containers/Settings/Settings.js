import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Button, Input } from "reactstrap";

class Settings extends Component {
  render() {
    return (
      <Container style={{color: "white"}}>
        <div className="text-center">
          <h1>Settings</h1>
        </div>
        <Row>
          <Col>Player Name</Col>
          <Col><Input type="text" value={this.props.playerName} onChange={this.props.onNameChange}/></Col>
        </Row>
        <Row>
          <Col>Music:</Col>
          <Col>Setting goes here</Col>
        </Row>
        <Row>
          <Col>Sound Effects</Col>
          <Col>Setting goes here</Col>
        </Row>
        <Button color="light" onClick={() => this.props.link("Lobby")}>
          Return Home
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    playerName: state.playerName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onNameChange: e => dispatch({type: "UPDATE_PLAYER_NAME", value: e.target.value})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
