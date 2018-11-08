import React, { Component } from "react";

import Frame from "./components/Frame/Frame";
import Router from "./router/Router";

import routes from "./router/routes/routes"

class App extends Component {
  render() {
    return (
      <div style={{ background: "#333" }}>
        <Frame>
          <Router routes={routes} />
        </Frame>
      </div>
    );
  }
}

export default App;
