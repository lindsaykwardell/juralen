class Archer {
  ID = Math.floor(Math.random() * 100000000000000);
  name = "Archer";
  cost = 3;
  move = 1;
  movesLeft = 1;
  maxMoves = 1;
  attack = 1;
  health = 3;
  maxHealth = 3;
  range = 2;
  description = "Ranged military unit. Useful in offense or defense.";
  controlledBy = null;
}

export default Archer;
