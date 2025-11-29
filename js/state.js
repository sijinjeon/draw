/**
 * @file state.js
 * @description 전역 상태 관리 (Observer 패턴)
 */

import { CONFIG } from './config.js';

export class AppState {
  constructor() {
    this._state = {
      // 참가자 데이터
      participants: [],

      // 설정
      settings: {
        winnerCount: 1,
        animationSpeed: 'normal',
        soundEnabled: true,
        themeStyle: 'space',
        darkMode: true
      },

      // 현재 상태
      currentMode: 'wheel',
      isRunning: false,

      // 결과
      winners: [],

      // 성능
      performanceLevel: 'high'
    };

    this._observers = new Set();
  }

  /**
   * Observer 등록
   * @param {Function} callback
   * @returns {Function} 구독 해제 함수
   */
  subscribe(callback) {
    this._observers.add(callback);
    return () => this._observers.delete(callback);
  }

  /**
   * 상태 변경 알림
   * @private
   */
  _notify(key, value) {
    this._observers.forEach(cb => cb(key, value, this._state));
  }

  // ========== Getters ==========
  get participants() {
    return this._state.participants;
  }

  get settings() {
    return this._state.settings;
  }

  get winners() {
    return this._state.winners;
  }

  get isRunning() {
    return this._state.isRunning;
  }

  get currentMode() {
    return this._state.currentMode;
  }

  get performanceLevel() {
    return this._state.performanceLevel;
  }

  // ========== Setters ==========
  setParticipants(names) {
    this._state.participants = names;
    this._notify('participants', names);
  }

  setWinners(winners) {
    this._state.winners = winners;
    this._notify('winners', winners);
  }

  setSetting(key, value) {
    this._state.settings[key] = value;
    this._notify(`settings.${key}`, value);
    this.saveToStorage();
  }

  setRunning(isRunning) {
    this._state.isRunning = isRunning;
    this._notify('isRunning', isRunning);
  }

  setCurrentMode(mode) {
    this._state.currentMode = mode;
    this._notify('currentMode', mode);
  }

  setPerformanceLevel(level) {
    this._state.performanceLevel = level;
    this._notify('performanceLevel', level);
  }

  // ========== 유틸리티 ==========
  
  /**
   * 추첨 시작 가능 여부 확인
   */
  canStart() {
    const minRequired = CONFIG.MODES[this._state.currentMode]?.minParticipants || 2;
    return this._state.participants.length >= minRequired && !this._state.isRunning;
  }

  /**
   * 상태 리셋
   */
  reset() {
    this._state.winners = [];
    this._state.isRunning = false;
    this._notify('reset', null);
  }

  /**
   * 로컬 스토리지에 설정 저장
   */
  saveToStorage() {
    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.settings,
        JSON.stringify(this._state.settings)
      );
    } catch (e) {
      console.warn('[State] localStorage 저장 실패:', e);
    }
  }

  /**
   * 로컬 스토리지에서 설정 로드
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.settings);
      if (saved) {
        const parsed = JSON.parse(saved);
        this._state.settings = { ...this._state.settings, ...parsed };
        this._notify('settingsLoaded', this._state.settings);
      }
    } catch (e) {
      console.warn('[State] localStorage 로드 실패:', e);
    }
  }
}

