const initialState = {
  playerName: localStorage.getItem("PlayerName") || "New Player",
  gameName: localStorage.getItem("GameName") || "Warlord's Feud",
  gridSize: "9",
  gameMode: "hotseat",
  isHostingGame: false,
  isGameRunning: false,
  connectedToGame: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_PLAYER_NAME":
      localStorage.setItem("PlayerName", action.value);
      return {
        ...state,
        playerName: action.value
      };
    case "SET_GAME_NAME":
      localStorage.setItem("GameName", action.name);
      return {
        ...state,
        gameName: action.name
      }
    case "SET_GAME_MODE":
      return {
        ...state,
        gameMode: action.mode
      }
    case "HOST_GAME":
      return {
        ...state,
        isHostingGame: true,
        isGameRunning: true,
        connectedToGame: action.gameID
      }
    case "JOIN_GAME":
      return {
        ...state,
        isHostingGame: false,
        isGameRunning: true,
        connectedToGame: action.gameID
      }
    case "END_GAME":
      return {
        ...state,
        isHostingGame: false,
        isGameRunning: false,
        connectedToGame: null
      }
    case "SET_GRID_SIZE":
      return {
        ...state,
        gridSize: action.size
      }
    default:
      return state;
  }
};

export default reducer;
