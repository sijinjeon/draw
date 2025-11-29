/**
 * @file theme-toggle.js
 * @description 다크/라이트 모드 및 테마 스타일 관리
 */

import { CONFIG } from '../config.js';

export class ThemeManager {
  constructor() {
    this.theme = this.getInitialTheme();
    this.themeStyle = this.getInitialThemeStyle();
    this.init();
  }

  /**
   * 초기 테마 결정 (다크/라이트)
   */
  getInitialTheme() {
    // 1. localStorage에서 사용자 선택 확인
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.theme);
    if (saved) return saved;

    // 2. 시스템 설정 감지
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  /**
   * 초기 테마 스타일 결정
   */
  getInitialThemeStyle() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.themeStyle);
    return saved || 'space';
  }

  /**
   * 초기화
   */
  init() {
    this.applyTheme(this.theme);
    this.applyThemeStyle(this.themeStyle);
    this.watchSystemTheme();
    this.bindEvents();
  }

  /**
   * 다크/라이트 모드 토글
   */
  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.theme);
    localStorage.setItem(CONFIG.STORAGE_KEYS.theme, this.theme);
  }

  /**
   * 테마 적용
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateIcon();
  }

  /**
   * 테마 스타일 적용
   */
  applyThemeStyle(style) {
    this.themeStyle = style;
    document.documentElement.setAttribute('data-theme-style', style);
    localStorage.setItem(CONFIG.STORAGE_KEYS.themeStyle, style);
  }

  /**
   * 아이콘 업데이트
   */
  updateIcon() {
    const icon = document.querySelector('.theme-toggle-icon');
    if (icon) {
      icon.textContent = this.theme === 'dark' ? '🌙' : '☀️';
    }
  }

  /**
   * 시스템 테마 변경 감지
   */
  watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        // 사용자가 수동 설정하지 않은 경우에만 자동 적용
        if (!localStorage.getItem(CONFIG.STORAGE_KEYS.theme)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    // 다크/라이트 토글 버튼
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }

    // 테마 스타일 셀렉트
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.value = this.themeStyle;
      themeSelect.addEventListener('change', (e) => {
        this.applyThemeStyle(e.target.value);
      });
    }
  }

  /**
   * 현재 테마 반환
   */
  getTheme() {
    return this.theme;
  }

  /**
   * 현재 테마 스타일 반환
   */
  getThemeStyle() {
    return this.themeStyle;
  }

  /**
   * 다크 모드 여부
   */
  isDark() {
    return this.theme === 'dark';
  }
}

