import Unit from "./Unit";

class Archer extends Unit {
  constructor() {
    super();
    this.name = "Archer";
    this.cost = 3;
    this.move = 1;
    this.movesLeft = 1;
    this.maxMoves = 1;
    this.attack = 1;
    this.health = 3;
    this.maxHealth = 3;
    this.range = 2;
    this.description = "Ranged military unit. Useful in offense or defense.";
  }
}

export default Archer;
