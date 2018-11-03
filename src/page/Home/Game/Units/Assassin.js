class Assassin {
  ID = Math.floor(Math.random() * 100000000000000);
  name = "Assassin";
  cost = 5;
  move = 1;
  movesLeft = 2;
  maxMoves = 2;
  attack = 3;
  health = 1;
  maxHealth = 1;
  range = 1;
  description = "Offensive unit. Can move twice, and hides in the forest.";
}

export default Assassin;