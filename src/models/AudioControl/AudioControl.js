export default class AudioControl {
  constructor(audio, music) {
    this.audio = audio;
    this.audio.volume = 0;
    this.music = music;
    this.maxVol = 1;
    this.nextAction = null;
    this.shuffle = null;
  }

  play = () => {
    this.audio.play();
  };

  pause = () => {
    this.audio.pause();
  };

  stop = () => {
    return new Promise(resolve => {
      this.fadeOut().then(() => {
        this.audio.pause();
        this.audio.currentTime = 0;
        resolve();
      });
    });
  };

  selectSong = song => {
    const loc = song.split(":");
    this.audio.src = this.music[loc[0]][loc[1]];
  };

  shuffleAlbum = album => {
    this.shuffle = album;
    this.nextShuffle();  
    this.audio.addEventListener("ended", this.nextShuffle);
  };

  nextShuffle = () => {
    let track = -1;
    while (!this.music[this.shuffle][track]) {
      track = Math.floor(
        Math.random() * (this.music[this.shuffle].length)
      );
    }
    this.audio.src = this.music[this.shuffle][track];
    this.fadeIn();
  }

  stopShuffle = () => {
    this.audio.removeEventListener("ended", this.nextShuffle);
  };

  setMaxVolume = maxVol => {
    this.maxVol = maxVol;
  };

  setVolume = vol => {
    this.audio.volume = vol;
  };

  fadeOut = () => {
    return new Promise(resolve => {
      const fadeAudio = setInterval(() => {
        if (this.audio.volume !== 0 && this.audio.volume - 0.1 >= 0) {
          this.audio.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          resolve();
        }
      }, 200);
    });
  };

  fadeIn = () => {
    this.audio.volume = 0;
    this.play();
    const fadeAudio = setInterval(() => {
      if (this.audio.volume < this.maxVol && this.audio.volume + 0.05 <= 1) {
        this.audio.volume += 0.05;
      } else {
        clearInterval(fadeAudio);
      }
    }, 200);
  };
}
