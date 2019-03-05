import Unit from "./Unit";

class Siege extends Unit {
  constructor() {
    super();
    this.name = "Siege Weapon";
    this.cost = 3;
    this.move = 1;
    this.movesLeft = 1;
    this.maxMoves = 1;
    this.attack = 3;
    this.health = 5;
    this.maxHealth = 3;
    this.range = 2;
    this.description = "Ranged siege unit. Only deals damage against towns and castles.";
  }
}

export default Siege;
