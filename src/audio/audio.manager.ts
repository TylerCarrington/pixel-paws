import { useGameStore } from '../stores/game.store';

class AudioManager {
  private static instance: AudioManager;
  private music: HTMLAudioElement | null = null;
  private sfx: HTMLAudioElement[] = [];

  private constructor() {}

  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  playMusic(url: string) {
    if (this.music) {
      if (this.music.src.includes(url)) return;
      this.music.pause();
    }

    const musicVolume = useGameStore.getState().settings.musicVolume;
    this.music = new Audio(url);
    this.music.loop = true;
    this.music.volume = musicVolume;
    
    // Autoplay might be blocked by browser until user interaction
    this.music.play().catch(e => console.warn('Music autoplay blocked', e));
  }

  updateMusicVolume(volume: number) {
    if (this.music) {
      this.music.volume = volume;
    }
  }

  playSFX(url: string) {
    const sfxVolume = useGameStore.getState().settings.sfxVolume;
    const sound = new Audio(url);
    sound.volume = sfxVolume;
    sound.play().catch(e => console.warn('SFX play blocked', e));
    
    // Clean up finished sounds
    sound.onended = () => {
      this.sfx = this.sfx.filter(s => s !== sound);
    };
    this.sfx.push(sound);
  }
}

export const audioManager = AudioManager.getInstance();
