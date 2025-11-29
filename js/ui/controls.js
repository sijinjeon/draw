/**
 * @file controls.js
 * @description 메인 UI 컨트롤러
 */

import { parseParticipants, validateParticipants, isDuplicate } from '../utils/parser.js';
import { CONFIG } from '../config.js';
import { Toast } from './toast.js';

export class UIController {
  constructor(state, app) {
    this.state = state;
    this.app = app;
    this.debounceTimer = null;

    // DOM 요소
    this.elements = {
      participantTrigger: document.getElementById('participant-trigger'),
      participantDropdown: document.getElementById('participant-dropdown'),
      participantInput: document.getElementById('participant-input'),
      participantCount: document.getElementById('participant-count'),
      participantPreview: document.getElementById('participant-preview'),
      winnerCount: document.getElementById('winner-count'),
      speedSelect: document.getElementById('speed-select'),
      soundToggle: document.getElementById('sound-toggle'),
      fullscreenBtn: document.getElementById('fullscreen-btn'),
      startButton: document.getElementById('start-button'),
      modeCards: document.querySelectorAll('.mode-card')
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateStartButton();

    // 상태 구독
    this.state.subscribe((key, value) => this.handleStateChange(key, value));
  }

  bindEvents() {
    // 참가자 입력 드롭다운 토글
    this.elements.participantTrigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.participant-control')) {
        this.closeDropdown();
      }
    });

    // ESC로 드롭다운 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });

    // 참가자 입력
    this.elements.participantInput?.addEventListener('input', (e) => {
      this.handleInputDebounced(e.target.value);
    });

    // 모드 선택
    this.elements.modeCards.forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        this.setActiveMode(mode);
        this.app.loadMode(mode);
      });
    });

    // 당첨자 수 변경
    this.elements.winnerCount?.addEventListener('change', (e) => {
      this.state.setSetting('winnerCount', parseInt(e.target.value));
    });

    // 속도 변경
    this.elements.speedSelect?.addEventListener('change', (e) => {
      this.state.setSetting('animationSpeed', e.target.value);
    });

    // 사운드 토글
    this.elements.soundToggle?.addEventListener('click', () => {
      const enabled = !this.state.settings.soundEnabled;
      this.state.setSetting('soundEnabled', enabled);
      this.updateSoundIcon(enabled);
      this.app.sound?.setEnabled(enabled);
    });

    // 풀스크린
    this.elements.fullscreenBtn?.addEventListener('click', () => {
      this.app.toggleFullscreen();
    });

    // 추첨 시작
    this.elements.startButton?.addEventListener('click', () => {
      this.app.startDraw();
    });
  }

  /**
   * 드롭다운 토글
   */
  toggleDropdown() {
    const isOpen = this.elements.participantTrigger?.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * 드롭다운 열기
   */
  openDropdown() {
    this.elements.participantTrigger?.setAttribute('aria-expanded', 'true');
    this.elements.participantDropdown?.removeAttribute('hidden');
    this.elements.participantInput?.focus();
  }

  /**
   * 드롭다운 닫기
   */
  closeDropdown() {
    this.elements.participantTrigger?.setAttribute('aria-expanded', 'false');
    this.elements.participantDropdown?.setAttribute('hidden', '');
  }

  /**
   * 입력 처리 (디바운스)
   */
  handleInputDebounced(value) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.handleInput(value);
    }, 300);
  }

  /**
   * 입력 처리
   */
  handleInput(value) {
    const { names, errors } = parseParticipants(value);

    this.state.setParticipants(names);
    this.updateParticipantCount(names.length);
    this.updateParticipantPreview(names);
    this.updateStartButton();

    if (errors.length > 0) {
      Toast.warning(errors[0]);
    }
  }

  /**
   * 참가자 수 업데이트
   */
  updateParticipantCount(count) {
    if (this.elements.participantCount) {
      this.elements.participantCount.textContent = `${count}명`;
    }
  }

  /**
   * 참가자 미리보기 업데이트
   */
  updateParticipantPreview(names) {
    if (!this.elements.participantPreview) return;

    if (names.length === 0) {
      this.elements.participantPreview.innerHTML = '';
      return;
    }

    const tags = names.slice(0, 20).map(name => {
      const className = isDuplicate(name) ? 'participant-tag duplicate' : 'participant-tag';
      return `<span class="${className}">${this.escapeHtml(name)}</span>`;
    }).join('');

    const more = names.length > 20 ? `<span class="participant-tag">+${names.length - 20}명</span>` : '';

    this.elements.participantPreview.innerHTML = tags + more;
  }

  /**
   * 시작 버튼 상태 업데이트
   */
  updateStartButton() {
    if (!this.elements.startButton) return;

    const canStart = this.state.canStart();
    this.elements.startButton.disabled = !canStart;
  }

  /**
   * 모드 카드 활성화
   */
  setActiveMode(mode) {
    this.elements.modeCards.forEach(card => {
      const isActive = card.dataset.mode === mode;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-pressed', isActive.toString());
    });
  }

  /**
   * 사운드 아이콘 업데이트
   */
  updateSoundIcon(enabled) {
    const icon = this.elements.soundToggle?.querySelector('.sound-toggle-icon');
    if (icon) {
      icon.textContent = enabled ? '🔊' : '🔇';
    }
  }

  /**
   * 상태 변경 핸들러
   */
  handleStateChange(key, value) {
    switch (key) {
      case 'isRunning':
        this.elements.startButton.disabled = value || !this.state.canStart();
        this.elements.startButton.textContent = value ? '추첨 중...' : '🎰 추첨 시작';
        break;

      case 'settingsLoaded':
        // 설정 UI 동기화
        if (this.elements.winnerCount) {
          this.elements.winnerCount.value = value.winnerCount;
        }
        if (this.elements.speedSelect) {
          this.elements.speedSelect.value = value.animationSpeed;
        }
        this.updateSoundIcon(value.soundEnabled);
        break;

      case 'currentMode':
        this.setActiveMode(value);
        this.updateStartButton();
        break;
    }
  }

  /**
   * UI 리셋
   */
  reset() {
    if (this.elements.participantInput) {
      this.elements.participantInput.value = '';
    }
    this.updateParticipantCount(0);
    this.updateParticipantPreview([]);
    this.updateStartButton();
    this.closeDropdown();
  }

  /**
   * HTML 이스케이프
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

