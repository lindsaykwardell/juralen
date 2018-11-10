import React, { Component } from "react";
import { Container, Input, FormGroup, Label, Button } from "reactstrap";
import firebase from "../../config/db/firebase";
import classes from "./Login.module.css";

export default class Login extends Component {
  state = {
    emailAddress: "",
    password: "",
    error: null
  };

  enterEmailHandler = e => {
    this.setState({ emailAddress: e.target.value, error: null });
  };

  enterPasswordHandler = e => {
    this.setState({ password: e.target.value, error: null });
  };

  onLoginHandler = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.emailAddress, this.state.password)
      .catch(error => {
        this.setState({ error });
        // Handle Errors here.
      });
  };

  onRegisterHandler = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.state.emailAddress,
        this.state.password
      )
      .then(() => {
        const user = firebase.auth().currentUser;

        user.updateProfile({
          displayName: "Lord Knave"
        })
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  render() {
    return (
      <div className={classes.login}>
        <Container className={classes.bullseye}>
          <h1 className="text-center">Juralen</h1>
          <div className={classes.box}>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="text"
                value={this.state.emailAddress}
                onChange={this.enterEmailHandler}
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={this.state.password}
                onChange={this.enterPasswordHandler}
              />
            </FormGroup>
            <div className="text-center">
              <Button
                color="primary"
                className="mr-4"
                onClick={this.onLoginHandler}
              >
                Sign In
              </Button>
              <Button
                color="success"
                className="ml-4"
                onClick={this.onRegisterHandler}
              >
                Register
              </Button>
              <div className="text-danger">
                {this.state.error
                  ? `${this.state.error.code}: ${this.state.error.message}`
                  : ""}
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}
