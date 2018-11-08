import React, { Component } from 'react'

export default class Frame extends Component {
  state = {
    activeTransition: false
  }

  toggleTransitionHandler = () => {
    return new Promise(resolve => {
      this.setState({ activeTransition: !this.state.activeTransition });
      setTimeout(() => {
        resolve();
      }, 500);
    })
  }

  render() {
    const frame = {
      position: "absolute",
      width: "100%",
      height: "100%",
      background: "#333",
      opacity: this.state.activeTransition ? "0" : "1",
      transition: "0.5s",
      zIndex: "1"
    };

    return (
      <div style={frame}>
        {React.cloneElement(this.props.children, {toggleTransition: this.toggleTransitionHandler})}
      </div>
    )
  }
}
