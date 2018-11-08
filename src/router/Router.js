import React, { Component } from "react";

export default class Router extends Component {
  state = {
    openPage: "Home",
    prevProps: null
  };

  beforeLeaveHandler = () => {
    return new Promise((resolve, reject) => {
      try {
        if (this.props.routes[this.state.openPage].beforeLeave()) {
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
        if (this.props.routes[target].beforeEnter()) {
          const res = this.props.routes[target].beforeEnter();
          resolve(res);
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
        return this.beforeEnterHandler(target);
      })
      .then(updatedTarget => {
        if (updatedTarget !== true) {
          target = updatedTarget;
        }
        return this.props.toggleTransition();
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
    const OpenPage = this.props.routes[this.state.openPage];

    return (
      <OpenPage.component
        toggleTransition={this.props.toggleTransition}
        prevProps={this.state.prevProps}
        link={this.link}
      />
    );
  }
}
