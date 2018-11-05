import React from "react";
import classes from "./Menu.module.css";

export default props => {
  return <div className={classes.menu}>{props.children}</div>;
};
