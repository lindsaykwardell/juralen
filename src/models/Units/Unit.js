import sfx from "../../audio/sfx";

export default class Unit {
  constructor() {
    this.ID = Math.floor(Math.random() * 100000000000000);
    this.name = "Unit";
    this.cost = 0;
    this.move = 0;
    this.movesLeft = 0;
    this.maxMoves = 0;
    this.attack = 0;
    this.health = 0;
    this.maxHealth = 0;
    this.range = 0;
    this.description = "You shouldn't see this.";
    this.controlledBy = null;
  }

  isBuilt() {
    if (sfx.built[this.name]) {
      const audio = new Audio();
      audio.src = sfx.built[this.name];
      audio.play();
    }
  }

  isClicked() {
    if (sfx.clicked[this.name]) {
      const audio = new Audio();
      audio.src = sfx.clicked[this.name];
      audio.play();
    }
  }

  attack() {
    return this.attack;
  }

  takeDamage(dmg) {
    this.health -= dmg;
  }

  isDead() {
    if (this.health <= 0) {
      return true;
    } else {
      return false;
    }
  }
}
