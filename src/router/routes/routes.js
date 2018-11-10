import Splash from "../../components/Splash/Splash";
import Login from "../../containers/Login/Login";
import Lobby from "../../containers/Lobby/Lobby";
import Game from "../../containers/Game/Game";
import Settings from "../../containers/Settings/Settings";

import audioControl from "../../config/audioControl";

// beforeEnter MUST return true to go to the route.
// Any other return value will redirect to a different page.
// Returning false cancels the route.

// Returning false (or 0, etc) on beforeLeave will cancel the route
// but any other value will be ignored and treated as true

export default {
  Splash: {
    component: Splash
  },
  Login: {
    component: Login,
  },
  Lobby: {
    component: Lobby
  },
  Game: {
    component: Game,
    beforeEnter: () => {
      audioControl.fadeOut().then(() => {
        audioControl.maxVol = 0.4;
        audioControl.shuffleAlbum("inGame");
      });
    },
    beforeLeave: () => {
      audioControl.fadeOut().then(() => {
        audioControl.stopShuffle();
        audioControl.selectSong("theme:0");
        audioControl.maxVol = 1;
        audioControl.fadeIn();
      })
    }
  },
  Settings: {
    component: Settings
  }
};
