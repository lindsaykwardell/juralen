import React, { Component } from "react";

import routes from "./routes/routes";

export default class Router extends Component {
  state = {
    openPage: "Home",
    prevProps: null,
    routes
  };

  beforeLeaveHandler = () => {
    return new Promise((resolve, reject) => {
      try {
        if (routes[this.state.openPage].beforeLeave()) {
          resolve();
        } else {
          reject();
        }
      } catch (err) {
        resolve();
      }
    });
  };

  beforeEnterHandler = target => {
    return new Promise((resolve, reject) => {
      try {
        if (routes[target].beforeEnter()) {
          resolve();
        } else {
          reject();
        }
      } catch (err) {
        resolve();
      }
    });
  };

  link = (target, prevProps) => {
    this.beforeLeaveHandler()
      .then(() => {
        return this.props.toggleTransition();
      })
      .then(() => {
        return this.beforeEnterHandler(target);
      })
      .then(() => {
        this.setState({ openPage: target, prevProps }, () => {
          this.props.toggleTransition();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const OpenPage = routes[this.state.openPage];

    return (
      <OpenPage.component
        toggleTransition={this.props.toggleTransition}
        prevProps={this.state.prevProps}
        link={this.link}
      />
    );
  }
}
