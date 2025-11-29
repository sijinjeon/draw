/**
 * @file BaseMode.js
 * @description 모든 추첨 모드의 추상 베이스 클래스
 */

import { shuffle } from '../utils/shuffle.js';
import { launchConfetti } from '../utils/confetti.js';

export class BaseMode {
  constructor(state, sound) {
    if (new.target === BaseMode) {
      throw new Error('BaseMode는 직접 인스턴스화할 수 없습니다.');
    }

    this.state = state;
    this.sound = sound;
    this.container = null;
    this.isInitialized = false;
    this.animationId = null;
  }

  /**
   * 모드 초기화 (필수 구현)
   * @abstract
   */
  init() {
    throw new Error('init() 메서드를 구현해야 합니다.');
  }

  /**
   * 추첨 시작 (필수 구현)
   * @abstract
   */
  start() {
    throw new Error('start() 메서드를 구현해야 합니다.');
  }

  /**
   * 모드 리셋 (필수 구현)
   * @abstract
   */
  reset() {
    throw new Error('reset() 메서드를 구현해야 합니다.');
  }

  /**
   * 컨테이너 설정
   */
  setupContainer() {
    this.container = document.getElementById('mode-container');
    if (!this.container) {
      console.error('[BaseMode] mode-container를 찾을 수 없습니다.');
      return false;
    }

    // 플레이스홀더 제거
    const placeholder = this.container.querySelector('.canvas-placeholder');
    if (placeholder) {
      placeholder.remove();
    }

    return true;
  }

  /**
   * 리사이즈 핸들러 (오버라이드 가능)
   */
  resize() {
    // 기본 구현 없음
  }

  /**
   * 모드 정리
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.container) {
      this.container.innerHTML = `
        <div class="canvas-placeholder">
          <div class="placeholder-content">
            <span class="placeholder-icon">🎰</span>
            <p class="placeholder-text">모드를 선택하고 참가자를 입력하세요</p>
            <p class="placeholder-hint">Space: 시작 | F: 풀스크린 | D: 다크모드 | 1-4: 모드</p>
          </div>
        </div>
      `;
    }

    this.isInitialized = false;
  }

  /**
   * 당첨자 선정 (Fisher-Yates 셔플 기반)
   * @param {number} count - 당첨자 수
   * @returns {string[]} - 당첨자 이름 배열
   */
  selectWinners(count) {
    const shuffled = shuffle([...this.state.participants]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * 당첨 완료 처리
   * @param {string[]} winners
   */
  onComplete(winners) {
    this.state.setWinners(winners);
    this.state.setRunning(false);

    // 폭죽 효과
    launchConfetti();

    // 당첨 사운드
    this.sound?.play('fanfare');

    // 커스텀 이벤트 발생
    document.dispatchEvent(new CustomEvent('drawComplete', {
      detail: { winners, mode: this.state.currentMode }
    }));
  }

  /**
   * 컨테이너 크기 반환
   */
  getContainerSize() {
    if (!this.container) return { width: 800, height: 600 };

    return {
      width: this.container.clientWidth || 800,
      height: this.container.clientHeight || 600
    };
  }

  /**
   * 색상 팔레트 생성
   * @param {number} count - 필요한 색상 수
   * @returns {string[]}
   */
  generateColors(count) {
    const hueStep = 360 / count;
    return Array.from({ length: count }, (_, i) =>
      `hsl(${i * hueStep}, 70%, 55%)`
    );
  }
}

