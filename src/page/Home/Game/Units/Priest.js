class Priest {
  ID = Math.floor(Math.random() * 100000000000000);
  name = "Priest";
  cost = 4;
  move = 1;
  movesLeft = 1;
  maxMoves = 1;
  attack = 0;
  health = 5;
  maxHealth = 5;
  range = 0;
  description =
    "Heals other units in this square during combat and at the end of each turn.";
  controlledBy = null;
}

export default Priest;
