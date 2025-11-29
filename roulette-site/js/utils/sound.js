/**
 * @file sound.js
 * @description Howler.js 기반 사운드 관리
 */

import { CONFIG } from '../config.js';

export class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.7;
    this.loaded = false;
  }

  /**
   * 사운드 사전 로드
   */
  preload() {
    if (typeof Howl === 'undefined') {
      console.warn('[SoundManager] Howler.js가 로드되지 않았습니다.');
      return;
    }

    Object.entries(CONFIG.SOUNDS).forEach(([key, src]) => {
      try {
        this.sounds[key] = new Howl({
          src: [src],
          volume: this.volume,
          preload: true,
          onloaderror: () => {
            console.warn(`[SoundManager] ${key} 로드 실패: ${src}`);
          }
        });
      } catch (e) {
        console.warn(`[SoundManager] ${key} 초기화 실패:`, e);
      }
    });

    this.loaded = true;
  }

  /**
   * 사운드 재생
   * @param {string} soundName
   */
  play(soundName) {
    if (!this.enabled) return;

    const sound = this.sounds[soundName];
    if (sound) {
      try {
        sound.play();
      } catch (e) {
        console.warn(`[SoundManager] ${soundName} 재생 실패:`, e);
      }
    }
  }

  /**
   * 사운드 정지
   * @param {string} soundName
   */
  stop(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.stop();
    }
  }

  /**
   * 모든 사운드 정지
   */
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      try {
        sound.stop();
      } catch (e) {
        // 무시
      }
    });
  }

  /**
   * 사운드 활성화/비활성화
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  /**
   * 볼륨 설정
   * @param {number} volume - 0 ~ 1
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      try {
        sound.volume(this.volume);
      } catch (e) {
        // 무시
      }
    });
  }

  /**
   * 현재 상태 반환
   */
  isEnabled() {
    return this.enabled;
  }
}

