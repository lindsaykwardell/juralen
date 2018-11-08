import Home from "../../page/Home/Home";
import Settings from "../../page/Settings/Settings";

export default {
  Home: {
    component: Home,
    beforeEnter: () => {
      console.log("Into Home");
      return true;
    }
  },
  Settings: {
    component: Settings,
    beforeEnter: () => {
      console.log("Into settings.");
      return true;
    },
    beforeLeave: () => {
      alert("Have a good one!");
      return true;
    }
  }
};
