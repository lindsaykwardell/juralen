<Col
  sm="4"
  className={`${classes.box} ${classes.logboxContainer} ${
    this.props.activeData !== "log" ? classes.inactive : ""
    }`}
>
  <div className={classes.logbox}>
    {this.props.gameLog.map((log, index) => {
      if (log.includes("Player1: ")) {
        return (
          <div
            key={index}
            style={{ color: Player1, fontWeight: "bold" }}
          >
            {log}
          </div>
        );
      }
      if (log.includes("Player2: ")) {
        return (
          <div
            key={index}
            style={{ color: Player2, fontWeight: "bold" }}
          >
            {log}
          </div>
        );
      }
      return <div key={index}>{log}</div>;
    })}
  </div>
  <Input
    type="text"
    className="mt-2"
    value={this.props.message}
    onChange={this.props.messageInput}
    onKeyPress={this.props.submitMessage}
  />
</Col>