const Player1 = "#dc3545";
const Player2 = "#007bff";
const Plains = "#9b7653";
const Mountain = "#aaa";
const Forest = "#48854f";

export default class Cell {
  constructor(x, y, gridSize) {
    this.x = x;
    this.y = y;
    this.structure = "None";
    this.terrain = "Plains";
    this.controlledBy = "None";
    this.color = Plains;
    this.units = { Player1: [], Player2: [] };
    this.defBonus = 0;
    this.specialUnit = "None";

    if (x === gridSize - 1 && y === gridSize - 1) {
      this.structure = "Castle";
      this.defBonus = 5;
      this.controlledBy = "Player2";
      this.color = Player2;
      this.border = Plains;
    } else if (x === 0 && y === 0) {
      this.structure = "Castle";
      this.defBonus = 5;
      this.controlledBy = "Player1";
      this.color = Player1;
      this.border = Plains;
    } else {
      const roll = Math.floor(Math.random() * 101);
      if (roll <= 12) {
        this.structure = "Town";
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
      if (roll > 12 && roll <= 20) {
        this.terrain = "Mountain";
        this.color = Mountain;
      }
      if (roll > 20 && roll <= 40) {
        this.terrain = "Forest";
        this.color = Forest;
        this.defBonus = 1;
      }
    }
  }

  gainControl(Player) {
    this.controlledBy = Player;
    this.color = Player === "Player1" ? Player1 : Player2;
  }

  fortify() {
    this.defBonus++;
  }

  takeDamage(damage) {
    this.defBonus -= damage;
  }

  upgradeToCastle() {
    this.structure = "Castle";
    if (this.defBonus < 5) this.defBonus = 5;
  }

  runCombat(resources, gameLog, me, notMe) {
    let atkPlr = me;
    let defPlr = notMe;

    while (
      this.units[me].length > 0 &&
      this.units[notMe].length > 0
    ) {
      const attacker = Math.floor(Math.random() * this.units[atkPlr].length);
      const defender = Math.floor(Math.random() * this.units[defPlr].length);

      gameLog.unshift(
        `${this.units[atkPlr][attacker].name} is attacking ${
          this.units[defPlr][defender].name
        }`
      );
      // Attacker deals first damage
      // If cell has defBonus, and attacker is me, hit that first.
      // Assassins don't care about cell defBonus.
      // Priests don't attack
      if (this.units[atkPlr][attacker].name !== "Priest") {
        if (
          this.defBonus > 0 &&
          atkPlr === me &&
          this.units[atkPlr][attacker].name !== "Assassin"
        ) {
          this.takeDamage(this.units[atkPlr][attacker].attack);
          gameLog.unshift(`Defense bonus reduced to ${this.defBonus}`);
        } // Otherwise, hit the unit.
        else {
          this.units[defPlr][defender].health -= this.units[atkPlr][
            attacker
          ].attack;
        }
      }

      // If defender is still alive AND is in range, attack back.
      // Priests don't attack, but are never in range.
      // So we don't need an additional check for priest here.
      if (
        this.units[defPlr][defender].health > 0 &&
        this.units[defPlr][defender].range >= this.units[atkPlr][attacker].range
      ) {
        gameLog.unshift(
          `${this.units[defPlr][defender].name} is attacking ${
            this.units[atkPlr][attacker].name
          }`
        );
        // If structure has health, and defender is me, hit that first.
        // Assassins don't care about structure health.
        if (
          this.defBonus > 0 &&
          defPlr === me &&
          this.units[defPlr][defender].name !== "Assassin"
        ) {
          this.defBonus -= this.units[defPlr][defender].attack;
          gameLog.unshift(`Defense bonus reduced to ${this.defBonus}`);
        } else {
          this.units[atkPlr][attacker].health -= this.units[defPlr][
            defender
          ].attack;
        }
      }
      // If one of the characters is a priest,
      // heal all of that player's units by one
      // (except the priest)
      if (this.units[atkPlr][attacker].name === "Priest") {
        gameLog.unshift(`${atkPlr} priest is healing the party...`);
        this.units[atkPlr].forEach((unit, index) => {
          if (index !== attacker && unit.health < unit.maxHealth) {
            unit.health++;
          }
        });
      }
      if (this.units[defPlr][defender].name === "Priest") {
        gameLog.unshift(`${defPlr} priest is healing the party...`);
        this.units[defPlr].forEach((unit, index) => {
          if (index !== defender && unit.health < unit.maxHealth) {
            unit.health++;
          }
        });
      }

      // Remove defender if dead.
      if (this.units[defPlr][defender].health <= 0) {
        gameLog.unshift(
          `${defPlr} ${this.units[defPlr][defender].name} is dead!`
        );
        this.units[defPlr].splice(defender, 1);
        resources[defPlr].units--;
      }
      // Remove attacker if dead.
      if (this.units[atkPlr][attacker].health <= 0) {
        gameLog.unshift(
          `${atkPlr} ${this.units[atkPlr][attacker].name} is dead!`
        );
        this.units[atkPlr].splice(attacker, 1);
        resources[atkPlr].units--;
      }

      // Switch who goes first
      if (atkPlr === me) {
        atkPlr = notMe;
        defPlr = me;
      } else {
        atkPlr = me;
        defPlr = notMe;
      }
    }
    
    // Restore defBonus to 1 after combat.
    if (
      this.defBonus <= 0 &&
      (this.structure === "Town" ||
        this.structure === "Castle" ||
        this.terrain === "Forest")
    )
      this.fortify();
    return {resources, gameLog};
  }
}
