import React, { Component } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import Home from "./page/Home/Home";

library.add(faBars);

class App extends Component {
  state = {
    drawerIsOpen: true,
    activeTransition: false
  };

  openDrawerHandler = () => {
    this.setState({ drawerIsOpen: !this.state.drawerIsOpen });
  };

  toggleTransitionHandler = () => {
    return new Promise(resolve => {
      this.setState({ activeTransition: !this.state.activeTransition });
      setTimeout(() => {
        resolve();
      }, 500);
    })
  };

  render() {
    const frame = {
      position: "absolute",
      width: "100%",
      height: "100%",
      background: "#333",
      opacity: this.state.activeTransition ? "0":"1",
      transition: "0.5s",
      zIndex: "1"
    };
    return (
      <div style={{ background: "#333" }}>
        <div style={frame}>
          <Home toggleTransition={this.toggleTransitionHandler}/>
        </div>
      </div>
    );
  }
}

export default App;
