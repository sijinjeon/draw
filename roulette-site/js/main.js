/**
 * @file main.js
 * @description 애플리케이션 진입점
 */

import { CONFIG } from './config.js';
import { AppState } from './state.js';
import { UIController } from './ui/controls.js';
import { ThemeManager } from './ui/theme-toggle.js';
import { SoundManager } from './utils/sound.js';
import { PerformanceDetector } from './utils/performance.js';
import { ResultsManager } from './ui/results.js';
import { Toast } from './ui/toast.js';

class App {
  constructor() {
    this.state = new AppState();
    this.ui = null;
    this.theme = null;
    this.sound = null;
    this.results = null;
    this.currentMode = null;
  }

  async init() {
    try {
      console.log('🎰 Multi-Mode Roulette 초기화 중...');

      // 1. 성능 감지
      const perf = new PerformanceDetector();
      const level = perf.detect();
      this.state.setPerformanceLevel(level);
      console.log(`[App] 성능 레벨: ${level}`);

      // 2. 테마 매니저 초기화
      this.theme = new ThemeManager();

      // 3. 사운드 매니저 초기화
      this.sound = new SoundManager();
      this.sound.preload();

      // 4. 결과 매니저 초기화
      this.results = new ResultsManager(this.state);

      // 5. UI 컨트롤러 초기화
      this.ui = new UIController(this.state, this);

      // 6. 전역 이벤트 바인딩
      this.bindGlobalEvents();

      // 7. 저장된 설정 복원
      this.state.loadFromStorage();

      // 8. 기본 모드 로드
      await this.loadMode('wheel');

      console.log('🎰 Multi-Mode Roulette 초기화 완료!');

    } catch (error) {
      console.error('[App] 초기화 실패:', error);
      Toast.error('앱 초기화에 실패했습니다. 페이지를 새로고침해주세요.');
    }
  }

  /**
   * 모드 로드 (동적 임포트)
   */
  async loadMode(modeName) {
    // 기존 모드 정리
    if (this.currentMode) {
      this.currentMode.destroy();
    }

    const modeMap = {
      wheel: () => import('./modes/wheel-spinner.js'),
      marble: () => import('./modes/marble-race.js'),
      balloon: () => import('./modes/balloon-pop.js'),
      pirate: () => import('./modes/pirate-roulette.js')
    };

    try {
      console.log(`[App] 모드 로드: ${modeName}`);
      const module = await modeMap[modeName]();
      this.currentMode = new module.default(this.state, this.sound);
      this.currentMode.init();
      this.state.setCurrentMode(modeName);

    } catch (error) {
      console.error(`[App] 모드 로드 실패: ${modeName}`, error);
      Toast.error(`${CONFIG.MODES[modeName]?.name || modeName} 모드를 로드할 수 없습니다.`);
    }
  }

  /**
   * 전역 이벤트 바인딩
   */
  bindGlobalEvents() {
    // 키보드 단축키
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // 윈도우 리사이즈
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (this.currentMode) {
          this.currentMode.resize();
        }
      }, 100);
    });

    // 풀스크린 변경 감지
    document.addEventListener('fullscreenchange', () => {
      if (this.currentMode) {
        setTimeout(() => this.currentMode.resize(), 100);
      }
    });
  }

  /**
   * 키보드 단축키 처리
   */
  handleKeyPress(e) {
    // 입력 필드에서는 단축키 무시
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      return;
    }

    const handlers = {
      ' ': () => this.startDraw(),
      'f': () => this.toggleFullscreen(),
      'r': () => this.reset(),
      'd': () => this.theme?.toggle(),
      '1': () => this.loadMode('marble'),
      '2': () => this.loadMode('wheel'),
      '3': () => this.loadMode('balloon'),
      '4': () => this.loadMode('pirate'),
      'Escape': () => this.results?.close()
    };

    const handler = handlers[e.key.toLowerCase()];
    if (handler) {
      e.preventDefault();
      handler();
    }
  }

  /**
   * 추첨 시작
   */
  startDraw() {
    if (!this.state.canStart()) {
      const minRequired = CONFIG.MODES[this.state.currentMode]?.minParticipants || 2;
      Toast.warning(`참가자를 ${minRequired}명 이상 입력해주세요.`);
      return;
    }

    if (this.state.isRunning) {
      Toast.info('이미 추첨이 진행 중입니다.');
      return;
    }

    this.currentMode?.start();
  }

  /**
   * 풀스크린 토글
   */
  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('[App] 풀스크린 전환 실패:', err);
      });
    }
  }

  /**
   * 리셋
   */
  reset() {
    this.state.reset();
    this.ui?.reset();
    this.currentMode?.reset();
  }
}

// 앱 시작
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});

