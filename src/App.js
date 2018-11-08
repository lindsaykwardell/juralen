import React, { Component } from "react";

import Frame from "./components/Frame/Frame";
import Router from "./router/Router";

class App extends Component {
  render() {
    return (
      <div style={{ background: "#333" }}>
        <Frame>
          <Router />
        </Frame>
      </div>
    );
  }
}

export default App;
