import Unit from "./Unit";

class Soldier extends Unit {
  constructor() {
    super();
    this.name = "Soldier";
    this.cost = 1;
    this.move = 1;
    this.movesLeft = 1;
    this.maxMoves = 1;
    this.attack = 1;
    this.health = 2;
    this.maxHealth = 2;
    this.range = 1;
  }
}

export default Soldier;
