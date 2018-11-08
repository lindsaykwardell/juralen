import Home from "../../page/Home/Home";
import Settings from "../../page/Settings/Settings";

// beforeEnter MUST return true to go to the route.
// Any other return value will redirect to a different page.
// Returning false cancels the route.

// Returning false (or 0, etc) on beforeLeave will cancel the route
// but any other value will be ignored and treated as true  

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
      console.log("Leaving settings");
      return true;
    }
  }
};
