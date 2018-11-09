import Lobby from "../../containers/Lobby/Lobby";
import Game from "../../containers/Game/Game";
import Settings from "../../containers/Settings/Settings";

// beforeEnter MUST return true to go to the route.
// Any other return value will redirect to a different page.
// Returning false cancels the route.

// Returning false (or 0, etc) on beforeLeave will cancel the route
// but any other value will be ignored and treated as true

export default {
  Lobby: {
    component: Lobby
  },
  Game: {
    component: Game
  },
  Settings: {
    component: Settings
  }
};
