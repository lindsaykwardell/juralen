import React, { Component } from "react";

export default class Router extends Component {
  state = {
    openPage: "Lobby",
    prevProps: null
  };

  beforeLeaveHandler = () => {
    return new Promise((resolve, reject) => {
      if (this.props.routes[this.state.openPage].beforeLeave !== undefined) {
        const res = this.props.routes[this.state.openPage].beforeLeave();
        if (res === false) {
          reject();
        }
        resolve();
      } else {
        resolve();
      }
    });
  };

  beforeEnterHandler = target => {
    return new Promise((resolve, reject) => {
      if (this.props.routes[target].beforeEnter !== undefined) {
        const res = this.props.routes[target].beforeEnter();
        if (res === false) {
          reject();
        }
        resolve(res);
      } else {
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
        if (updatedTarget !== undefined && updatedTarget !== true) {
          target = updatedTarget;
        }
        if (this.props.beforeOpenRoute !== undefined) {
          return this.props.beforeOpenRoute();
        } else return true;
      })
      .then(() => {
        this.setState({ openPage: target, prevProps }, () => {
          if (this.props.afterOpenRoute !== undefined) {
            this.props.afterOpenRoute();
          }
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
