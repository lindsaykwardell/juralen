class Soldier {
  ID = Math.floor(Math.random() * 100000000000000);
  name = "Soldier";
  cost = 2;
  move = 1;
  movesLeft = 1;
  maxMoves = 1;
  attack = 1;
  health = 3;
  maxHealth = 3;
  range = 1;
  controlledBy = null;
}

export default Soldier;