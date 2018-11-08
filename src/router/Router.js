import React, { Component } from 'react'

import routes from "./routes/routes";

export default class Router extends Component {
  state = {
    openPage: "Home",
    prevProps: null,
    routes 
  }

  link = (target, prevProps) => {
    this.props.toggleTransition().then(() => {
      this.setState({openPage: target, prevProps}, () => {
        this.props.toggleTransition();
      })
    })
  }

  render() {
    const OpenPage = this.state.routes.find(page => {
      return page.name === this.state.openPage;
    })

    return (
      <OpenPage.component toggleTransition={this.props.toggleTransition} prevProps={this.state.prevProps} link={this.link} />
    )
  }
}
