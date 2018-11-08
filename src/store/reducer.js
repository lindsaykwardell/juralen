const initialState ={
  playerName: localStorage.getItem("PlayerName") || "New Player"
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case "UPDATE_PLAYER_NAME":
      localStorage.setItem("PlayerName", action.value);
      return {
        playerName: action.value
      }
    default:
      return state;
  }
}

export default reducer;