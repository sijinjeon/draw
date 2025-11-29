/**
 * @file toast.js
 * @description 토스트 알림 시스템
 */

const ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

const DURATIONS = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000
};

/**
 * 토스트 알림 클래스
 */
export class Toast {
  /**
   * 토스트 표시
   * @param {string} message - 메시지
   * @param {'success' | 'error' | 'warning' | 'info'} type - 타입
   * @param {number} duration - 지속 시간 (ms)
   */
  static show(message, type = 'info', duration) {
    const container = document.getElementById('toast-container');
    if (!container) {
      console.warn('[Toast] toast-container를 찾을 수 없습니다.');
      return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
      <span class="toast-message">${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    // 자동 제거
    const timeout = duration || DURATIONS[type] || 3000;
    setTimeout(() => {
      toast.classList.add('animate-fadeOut');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, timeout);
  }

  /**
   * 성공 토스트
   */
  static success(message, duration) {
    this.show(message, 'success', duration);
  }

  /**
   * 에러 토스트
   */
  static error(message, duration) {
    this.show(message, 'error', duration);
  }

  /**
   * 경고 토스트
   */
  static warning(message, duration) {
    this.show(message, 'warning', duration);
  }

  /**
   * 정보 토스트
   */
  static info(message, duration) {
    this.show(message, 'info', duration);
  }

  /**
   * HTML 이스케이프
   * @private
   */
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

