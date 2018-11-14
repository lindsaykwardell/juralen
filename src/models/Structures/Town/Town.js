const Plains = "#9b7653";

export default class Town {
  constructor() {
    this.structure = "Town";
    this.terrain = "Plains";
    this.color = Plains;
    this.defBonus = 3;
    const roll2 = Math.floor(Math.random() * 51);
    if (roll2 >= 0 && roll2 <= 10) {
      this.specialUnit = "Archer";
    }
    if (roll2 > 10 && roll2 <= 20) {
      this.specialUnit = "Assassin";
    }
    if (roll2 > 20 && roll2 <= 30) {
      this.specialUnit = "Knight";
    }
    if (roll2 > 30 && roll2 <= 40) {
      this.specialUnit = "Wizard";
    }
    if (roll2 > 40 && roll2 <= 50) {
      this.specialUnit = "Priest";
    }
  }
}