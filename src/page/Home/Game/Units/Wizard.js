class Wizard {
  ID = Math.floor(Math.random() * 100000000000000);
  name = "Wizard";
  cost = 7;
  move = 0.5;
  movesLeft = 2;
  maxMoves = 2;
  attack = 1;
  health = 1;
  maxHealth = 1;
  range = 2;
  description =
    "Highly mobile unit. Capable of teleporting other units across the board. Can also move twice.";
  controlledBy = null;
}

export default Wizard;
