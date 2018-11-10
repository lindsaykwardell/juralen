import AudioControl from "../models/AudioControl/AudioControl";

import celticWarrior from "../audio/celtic-warrior.mp3";
import anInnocentSword from "../audio/an-innocent-sword.mp3";
import crusadeOfTheCastellan from "../audio/crusade-of-the-castellan.mp3";
import guardians from "../audio/guardians.mp3";
import landOfAFolkDivided from "../audio/land-of-a-folk-divided.mp3";
import rememberTheWay from "../audio/remember-the-way.mp3";
import streetsOfSantIvo from "../audio/streets-of-santivo.mp3";

export default new AudioControl(new Audio(), {
  theme: [
    celticWarrior
  ],
  inGame: [
    anInnocentSword,
    crusadeOfTheCastellan,
    guardians,
    landOfAFolkDivided,
    rememberTheWay,
    streetsOfSantIvo
  ]
});