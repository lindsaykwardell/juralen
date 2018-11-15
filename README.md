## Juralen

Juralen is a fantasy turn-based strategy game based on the world of Ilandrior. Players take turns building soldiers and other units, expanding their kingdoms, and fighting with their armies. Take control of half the board, or wipe out your opponent, and you win the game.

[Live demo](https://warsofthejuriels.netlify.com/)

### Story

(To come) The game covers two eras of history.

The **Tutorial** will cover the life of Ilthanen Juralen, a holy warrior of the kingdom of Ilandri, as he leads an army of crusaders to retake the lost city of Althênor and reestablish human dominance over the ancient lands of Ilandrior. At the end of his campaign, Ilthanen takes the throne, and becomes High King of the Juralen Valley.

The main campaign, **The Dragonslayer Wars**, takes place much later. The lands of Juralen have become divided into smaller kingdoms, each vying for dominance over the others. The city of Althênor, now known as Alden, remains the seat of the High King, but the king's influence has waned in the face of constant warfare. At the peak of military prowess among the Juriel kingdoms, as they were known, rumors begin to spread of dragons returning to the land, and seeking to overthrow humanity once again. Meanwhile, the hillfolk of Halslad have discovered new magic that may be the key to defeating the new dragon threat.

### Rules

The game supports both hotseat mode and online play for two players. Player 1 will always go first. Each player starts with five gold, and four actions. Players may only build soldiers from their starting castle, but other units may be recruitable from nearby towns. Controlling more plains creates farms, which allows for more units to be controlled. Controlling more towns gives you more actions to take per turn. Forests and Mountains cannot be controlled, and do not provide any resources (although Forests do provide some protection).

### Movement

Units may move between squares. Units cannot move onto Mountain squares. Forests cannot be controlled. It takes one action to move a unit one square in any direction (Knights and Wizards take fewer actions to move). In addition, each unit has a number of moves they can make per turn. Soldiers, Archers, and Priests can only move once per turn, Wizards and Assassins can move twice per turn, Knights can move three times per turn. Moving into an uncontested Plains gives you control of it. Moving into a square with enemy units begins combat.

### Combat

Combat is automatic and instant. Units are chosen at random, then attack each other. Archers and Wizards have a range of two, so when they attack, they cannot be attacked back except by another archer or wizard. If an archer or wizard is attacked, both units will deal damage. If combat is taking place in a Town or Castle, then some of the damage by the attackers is mitigated (3 damage is prevented for attacking a Town, 5 for attacking a Castle). If a Priest is attacked, instead of dealing damage they heal the rest of the party (not themselves).

### Units

- Soldier: The basic unit.
- Archer: Ranged unit.
- Knight: Moves faster, is more heavily armed than other units.
- Assassin: High attack, low HP. Cannot be seen by opponents if located in a Forest. Does not ever have damage mitigated when attacking Towns or Castles.
- Priest: No attack, but heals all units in the same square at end of turn and during combat if attacked.
- Wizard: Ranged attack. Teleports units across the board for a single action per unit.

### Structures

- Castle: Each player starts with a castle. Can be upgraded to provide additional defense.
- Town: Grants additional action per turn. Also can build special units (Archer, Knight, Assassin, Priest, Wizard). Can be upgraded to provide additional defense. Also can be upgraded to a castle (fortification costs are cheaper for Castles).

### Game Modes

- Hotseat Mode - Two players take turns using the same computer to play. Turns pass between each player.
- Online Mode - Two players play across the Internet. When "Pass Turn" is clicked, the game gives control to the other player. Currently this is functional, but very limited. Online play currently is open to anyone, but will eventually require authentication.
- Vs AI Mode - Play 1v1 against a computer opponent. Still in development, and a bit buggy (may freeze without error).
- LAN Mode (to come) - Two players play over a local network. This will require download of the Desktop version of the game (to come).

- 2-Player: Each player is started in a corner.
- 3-Player (to come): Two players start in a corner, the third player is placed randomly on the board.
- 2v2 (to come): Teams of two players fight for control.
- 4-Player FFA (to come): Four players fight each other.

### Board Sizes

- 5x5
- 7x7
- 9x9

This game is in active development. The plan is to build out an Electron app for local network play with up to four players, or online play. There may also be an Android app that will be built, but for now the mobile experience is acceptable.
